import {TSceneID} from "../types/TSceneID";
import {TSceneStateID} from "../types/TSceneStateID";
import {TInventory} from "../types/TInventory";

export interface IO31State {
    activeScene: TSceneID;
    previousScene: TSceneID | null;
    sceneStateMap: Record<TSceneID, TSceneStateID>;
    inventory: TInventory;
    seenStates: Record<TSceneID, Record<TSceneStateID, number>>;
    playerState: {
        maxHealth: number;
        health: number;
        maxSanity: number;
        sanity: number;
    };
    elapsedTime: number;
}