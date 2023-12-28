import {O31Item} from "../../engine/classes/O31Item";
import {TItemState} from "../../engine/types/TItemState";

export class Computer extends O31Item {
    static id: string = "computer";
    name: string = "Computer";
    size: number = 100;
    weight: number = 20;
    canPickup: boolean = false;
    currentState: TItemState = "off";

    onInteract(_verbs?: string[]): void {
    }

    onInspect(): void {
    }

    onPickup(): void {
    }

    onUse(_target): void {
    }

    onUsedBy(_obj): void {
    }

}