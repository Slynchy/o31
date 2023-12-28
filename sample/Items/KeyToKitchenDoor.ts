import {O31Item} from "../../engine/classes/O31Item";
import {TItemID} from "../../engine/types/TItemID";
import {DoorToKitchen} from "./DoorToKitchen";
import {TItemState} from "../../engine/types/TItemState";
import {O31DefaultItemState} from "../../engine/constants/O31DefaultItemState";

export class KeyToKitchenDoor extends O31Item {
    static id: string = "key_to_kitchen_door";
    canPickup: boolean = true;
    name: string = "'Kitchen' key";
    size: number = 0;
    weight: number = 0;
    currentState: TItemState = O31DefaultItemState;

    onInspect(): void {
    }

    onInteract(_verbs?: string[]): void {
    }

    onPickup(): void {
        o31.describe("You pickup the skeleton key. It is marked 'Kitchen'", true);
    }

    onUse(_target: TItemID): void {
        if(_target == DoorToKitchen.id) {
            // write text
            o31.getItem(DoorToKitchen.id).currentState = "unlocked";
            o31.describe("You unlock the kitchen door.", true);
            o31.removeItemFromInventory(DoorToKitchen.id);
        }
    }

    onUsedBy(_obj: TItemID): void {
    }

}