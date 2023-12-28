import {IO31State} from "./interfaces/IO31State";
import {TSceneID} from "./types/TSceneID";
import {TSceneStateID} from "./types/TSceneStateID";
import {BayesClassifier} from "natural";
import {O31BaseFunctions} from "./constants/O31BaseFunctions";
import {O31Item} from "./classes/O31Item";
import {O31Scene} from "./classes/O31Scene";
import {TItemID} from "./types/TItemID";
import {preprocessText} from "../utils/preprocessText";
import {extractObjectsOfSentence} from "../utils/extractObjectsOfSentence";
import {extractVerbsOfSentence} from "../utils/extractVerbsOfSentence";
import Fuse, * as FuseInstance from "fuse.js";
import {IFuseOptions} from "fuse.js";

declare global {
    const o31: O31;
}

type TOnDescribeCallback = (_text: string) => void;

/**
 * The main class for the October31 text adventure engine
 * @class
 */
export class O31 {
    private debugMode: boolean = false;

    private _fuse: Fuse<string>;
    private _items: O31Item[] = [];
    private _scenes: O31Scene[] = [];
    private _onDescribeCallbacks: Array<TOnDescribeCallback> = [];
    private _classifier: BayesClassifier;
    private state: IO31State;

    public descriptionBuffer: string = "";

    constructor(_classifierBuffer: string, _debugMode?: boolean) {
        this.debugMode = _debugMode || false;

        let parent: object;
        try {
            parent = window;
        } catch(err) {
            // probably node
        }
        if(!parent) {
            // if this fails, let it
            parent = global;
        }
        if(parent["o31"]) {
            throw new Error("Only one instance of O31 is allowed!");
        } else {
            parent["o31"] = this;
        }

        this._classifier =
            BayesClassifier.restore(JSON.parse(_classifierBuffer));
    }

    public get currentScene(): O31Scene {
        return this._scenes.find(
            (e) => (
                e.constructor as typeof O31Scene
            ).id == this.state.activeScene
        );
    }

    public getItem(
        _id: TItemID
    ): O31Item {
        return this._items.find((e) => (
            e.constructor as typeof O31Item
        ).id == _id) || null;
    }

    private initializeInventoryItem(_id: TItemID): void {
        if(this.state.inventory[_id]) return;
        this.state.inventory[_id] = {
            quantity: 0,
            inspectCount: 0,
        };
    }

    public removeItemFromInventory(
        _id: TItemID,
        _quantity = Number.MAX_SAFE_INTEGER
    ): void {
        this.initializeInventoryItem(_id);
        this.state.inventory[_id].quantity =
            Math.max(
                this.state.inventory[_id].quantity - _quantity,
                0
            );
    }

    public addItemToInventory(
        _id: TItemID,
        _quantity: number = 1
    ): void {
        this.initializeInventoryItem(_id);
        this.state.inventory[_id].quantity += _quantity;
    }

    initialize(
        _items: typeof O31Item[],
        _scenes: typeof O31Scene[],
        _initialState: IO31State,
    ): void {
        if(!_initialState.activeScene) {
            throw new Error("Must specify a starting scene!");
        }
        this.state = _initialState;
        this._scenes = _scenes.map(
            // @ts-ignore
            (e) => new e()
        );
        this._items = _items.map(
            // @ts-ignore
            (e) => new e()
        );

        const fuseOptions: IFuseOptions<string> = {};
        // @ts-ignore
        this._fuse = new (FuseInstance as Fuse<string>)(
            [
                ...this._items.map((e) => e.name),
                ...this._scenes.map((e) => e.name)
            ],
            fuseOptions
        );
    }

    public hookOnDescribe(
        _callback: TOnDescribeCallback
    ): void {
        if(this._onDescribeCallbacks.indexOf(_callback) !== -1) {
            console.warn("Adding multiple of the same callback to onDescribe!");
        }
        this._onDescribeCallbacks.push(
            _callback
        );
    }

    public describe(_text: string, _append?: boolean): void {
        if(_append) {
            this.descriptionBuffer =
                this.descriptionBuffer + "\n" + _text;
        } else {
            this.descriptionBuffer = _text;
        }
        this._onDescribeCallbacks
            .forEach((cb) => cb(this.descriptionBuffer));
    }

    private classify(_str: string, threshold = 0.00001): O31BaseFunctions {
        const parsedStr = preprocessText(_str);

        const probabilities = this._classifier.getClassifications(
            parsedStr
        );
        const highestProbability = probabilities.reduce((max, p) => p.value > max ? p.value : max, 0);

        if(this.debugMode) {
            console.log(JSON.stringify(probabilities, null, "  "));
        }

        if (highestProbability < threshold) {
            return O31BaseFunctions.Unknown;
        } else {
            return this._classifier.classify(parsedStr) as O31BaseFunctions;
        }
    }

    public input(_text: string): void {
        const intent: O31BaseFunctions = this.classify(_text);

        const objects =
            extractObjectsOfSentence(_text) || [];
        const filteredObjects =
            objects
                .map((e) => {
                    const results = this._fuse.search(e);
                    if(!results.length) return null;
                    else {
                        return results[0].item;
                    }
                })
                .filter((e) => Boolean(e));
                // .filter((e) => this.currentScene.inspectableItems.indexOf(e) !== -1);

        const verbs = extractVerbsOfSentence(_text);
        this.executeFunction(
            intent,
            filteredObjects,
            verbs || [_text.split(" ")[0]]
        );
    }

    public findItem(_name: string): O31Item | null {
        const itemNames =
            this._items.map((e) => e.name.toLowerCase());
        const itemNameInd =
            itemNames.indexOf(_name.toLowerCase());
        const item =
            itemNameInd !== -1 ? (
                this._items[itemNameInd]
            ) : null;
        return item;
    }

    public executeFunction(
        _func: O31BaseFunctions,
        _objects: string[],
        _verbs: string[],
    ) {
        if(this.debugMode) {
            console.log(`Executing function "${_func}" with params "${JSON.stringify(_objects)}" and "${JSON.stringify(_verbs)}"`)
        }

        // todo: remove this line
        const currentScene = this.currentScene;

        const items =
            _objects.map((e) => this.findItem(e));

        switch(
            _func
        ) {
            case O31BaseFunctions.Inspect:
                if(_objects[0] == "room") {
                    currentScene
                        ?.onInspect();
                } else {
                    const item = this.findItem(
                        _objects[0]
                    );
                    if(
                        item &&
                        currentScene.inspectableItems.indexOf(
                            (item.constructor as typeof O31Item).id
                        ) !== -1
                    ) {
                        item.onInspect();
                    } else {
                        this.describe(`Could not find "${_objects[0]}" to ${_verbs[0] || "inspect"}`);
                    }
                }
                break;
            case O31BaseFunctions.Interact:
                if(
                    // use X on Y
                    _verbs[0] == "use" &&
                    items.length == 2
                ) {
                    items[0].onUse((items[1].constructor as typeof O31Item).id);
                } else {
                    if(
                        items[0] &&
                        currentScene.interactiveItems.indexOf(
                            (items[0].constructor as typeof O31Item).id
                        ) !== -1
                    ) {
                        items[0].onInteract(_verbs);
                    } else {
                        this.describe(`Could not find "${_objects[0]}" to ${_verbs[0] || "inspect"}`);
                    }
                }
                break;
            case O31BaseFunctions.LookAround:
                currentScene
                    ?.onInspect();
                break;
            case O31BaseFunctions.PickUp:
                if(
                    items[0] &&
                    items[0].canPickup
                ) {
                    this.addItemToInventory((items[0].constructor as typeof O31Item).id);
                    items[0].onPickup();
                    this.currentScene.removeItem(
                        (items[0].constructor as typeof O31Item).id,
                        true, true
                    );
                }
                break;
            case O31BaseFunctions.MoveTo:
                let adjSceneInd: number = -1;
                const adjSceneNames = currentScene.adjacentScenes.map((e) => {
                    return this._scenes.find(
                        (s) => (s.constructor as typeof O31Scene).id == e
                    ).name.toLowerCase();
                });
                if((adjSceneInd = adjSceneNames.indexOf(_objects[0].toLowerCase())) !== -1) {
                    this.moveToScene(currentScene.adjacentScenes[adjSceneInd]);
                } else if(currentScene.name == _objects[0]) {
                    this.describe("Cannot move there, you're already there.", true);
                } else {
                    this.describe("Cannot move there.", true);
                }
                break;
            case O31BaseFunctions.Unknown:
                this.describe("Unknown command.", true);
                break;
            default:
                console.warn("Function %s not yet implemented", _func);
                break;
        }
    }

    public moveToScene(_sceneId: TSceneID): void {
        const currentScene = this._scenes
            .find(
                (e) => (
                    e.constructor as typeof O31Scene
                ).id == this.state.activeScene
            );
        const targetScene =
            this._scenes
                .find((e) => (e.constructor as typeof O31Scene).id == _sceneId);

        const isAdjacent = currentScene.adjacentScenes.indexOf(
            (
                targetScene.constructor as typeof O31Scene
            ).id
        ) !== -1;
        if(!isAdjacent) {
            this.describe("That location is not reachable from here.", true);
            return;
        }
        const canEnter = targetScene.canEnter();
        if(!canEnter.result) {
            this.describe("Cannot enter; " + canEnter.reason, true);
            return;
        }

        currentScene
            .onExit();
        this.state.activeScene = _sceneId;
        targetScene
            .onEnter();
    }

    public hasItem(_itemId: TItemID): boolean {
        return this.state.inventory[_itemId] &&
            this.state.inventory[_itemId].quantity > 0;
    }

    public getNumOfSceneVisits(
        _sceneId: TSceneID,
        _sceneStateId?: TSceneStateID
    ): number {
        return (this.state.seenStates[_sceneId]?.[
            _sceneStateId || "default"
        ]);
    }
}