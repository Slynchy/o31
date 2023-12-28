import {O31Item} from "../../engine/classes/O31Item";
import {TItemID} from "../../engine/types/TItemID";

export class DoorToKitchen extends O31Item {
    static id: string = "door_to_kitchen";
    canPickup: boolean = false;
    name: string = "Kitchen door";
    size: number;
    weight: number;
    currentState = "locked";

    onInspect(): void {
    }

    onInteract(_verbs?: string[]): void {
    }

    onPickup(): void {
    }

    onUse(_target: TItemID): void {
    }

    onUsedBy(_obj: TItemID): void {
    }

}