import {O31Scene} from "../../engine/classes/O31Scene";
import {TSceneID} from "../../engine/types/TSceneID";
import {TItemID} from "../../engine/types/TItemID";
import {Computer} from "../Items/Computer";
import {TSceneStateID} from "../../engine/types/TSceneStateID";
import {O31DefaultSceneState} from "../../engine/constants/O31DefaultSceneState";
import {Kitchen} from "./Kitchen";
import {ICanEnterResult} from "../../engine/interfaces/ICanEnterResult";
import {LivingRoomCabinet} from "../Items/LivingRoomCabinet";

export class LivingRoom extends O31Scene {
    static id: TSceneID = "living_room";
    name: string = "Living room";
    inspectableItems: TItemID[] = [
        Computer.id,
        LivingRoomCabinet.id,
    ];
    interactiveItems: TItemID[] = [
        Computer.id,
        LivingRoomCabinet.id,
    ];
    adjacentScenes: TSceneID[] = [
        Kitchen.id
    ];
    currentState: TSceneStateID = O31DefaultSceneState;

    canEnter(): ICanEnterResult {
        return {
            result: true,
        };
    }

    onEnter(
        // _currState: TSceneStateID
    ): void {
        if(
            this.currentState === O31DefaultSceneState
        ) {
            switch(o31.getNumOfSceneVisits(LivingRoom.id, this.currentState)) {
                case 0:
                case 1:
                    break;
                default:
                    break;
            }
        }
    }

    onExit(
        // _currState: TSceneStateID
    ): void {
    }

    onInspect(
        // _currState: TSceneStateID
    ): void {
        o31.describe(`
The living room is old and musty, with layers of dust having accumulated over the years
forming an ashen blanket covering its contents, of which there were few; a fabric sofa of
once blue but now sun-bleached colour, a multi-doored cabinet upon which a cube-shaped CRT 
television seemingly stared back at its viewers, and a solitary desk propped against the wall, 
with an office chair pushed beneath it, and a yellowed-white computer sat silently hibernating
atop it, waiting for that required physical input it lacked to breath life into it once
more. 

Two doors allow passage from this room; one seemingly to a hallway, another to a kitchen.
`)
    }

}