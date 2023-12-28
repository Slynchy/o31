import {TSceneID} from "../types/TSceneID";
import {TItemID} from "../types/TItemID";
import {TSceneStateID} from "../types/TSceneStateID";
import {ICanEnterResult} from "../interfaces/ICanEnterResult";

export abstract class O31Scene {
    public static id: TSceneID;
    public abstract name: string;
    public abstract interactiveItems: TItemID[];
    public abstract inspectableItems: TItemID[];
    public abstract adjacentScenes: TSceneID[];
    public abstract currentState: TSceneStateID;

    public addItem(
        _id: TItemID,
        _interactive: boolean,
        _inspectable: boolean
    ): void {
        if(_interactive) {
            this.interactiveItems.push(_id);
        }
        if(_inspectable) {
            this.inspectableItems.push(_id);
        }
    }

    public removeItem(
        _id: TItemID,
        _interactive: boolean,
        _inspectable: boolean
    ): void {
        if(!_inspectable && !_interactive) {
            // why the fuck are you doing this?
            return;
        }

        if(_interactive) {
            const ind = this.interactiveItems.indexOf(_id);
            if(ind == -1) {
                // no item
            } else {
                this.interactiveItems.splice(ind, 1);
            }
        }
        if(_inspectable) {
            const ind = this.inspectableItems.indexOf(_id);
            if(ind == -1) {
                // no item
            } else {
                this.inspectableItems.splice(ind, 1);
            }
        }
    }

    public abstract canEnter(): ICanEnterResult;
    public abstract onInspect(
        // _currState: TSceneStateID
    ): void;
    public abstract onEnter(
        // _currState: TSceneStateID
    ): void;
    public abstract onExit(
        // _currState: TSceneStateID
    ): void;
}