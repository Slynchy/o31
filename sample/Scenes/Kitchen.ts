import {O31Scene} from "../../engine/classes/O31Scene";
import {TSceneID} from "../../engine/types/TSceneID";
import {TSceneStateID} from "../../engine/types/TSceneStateID";
import {TItemID} from "../../engine/types/TItemID";
import {LivingRoom} from "./LivingRoom";
import {O31DefaultSceneState} from "../../engine/constants/O31DefaultSceneState";
import {KeyToKitchenDoor} from "../Items/KeyToKitchenDoor";
import {ICanEnterResult} from "../../engine/interfaces/ICanEnterResult";
import {DoorToKitchen} from "../Items/DoorToKitchen";

export class Kitchen extends O31Scene {
    static id: string = "kitchen";
    name: string = "Kitchen";
    adjacentScenes: TSceneID[] = [
        LivingRoom.id
    ];
    currentState: TSceneStateID = O31DefaultSceneState;
    inspectableItems: TItemID[] = [];
    interactiveItems: TItemID[] = [];

    canEnter(): ICanEnterResult {
        const hasKey = o31.hasItem(KeyToKitchenDoor.id);
        const isUnlocked = o31.getItem(DoorToKitchen.id).currentState == "unlocked";

        return {
            result: isUnlocked,
            reason: hasKey ?
                "it is locked, but you do have the key."
                :
                "it is locked, and you do not have a key."
        }
    }

    onEnter(): void {
        o31.describe(`
The kitchen door swings open slowly; the musty, almost-oily air clambering to
escape into the living room from its entombment and filling your sinuses with
a gag-worthy smell. 

The cabinet doors hang pathetically on their hinges, no longer guarding their
contents- of which there were none. Whatever this room belonged to in the past
has long since vacated, taking as much of its possessions as it could.`
        );
    }

    onExit(): void {
    }

    onInspect(): void {
    }

}