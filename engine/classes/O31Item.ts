import {TItemID} from "../types/TItemID";
import {TItemState} from "../types/TItemState";

export abstract class O31Item {
    public static id: TItemID;
    public abstract name: string;
    public abstract weight: number;
    public abstract size: number;
    public abstract canPickup: boolean;
    public abstract currentState: TItemState;

    public abstract onInteract(_verbs?: string[]): void;
    public abstract onInspect(): void;
    public abstract onPickup(): void;
    public abstract onUse(_target: TItemID): void;
    public abstract onUsedBy(_obj: TItemID): void;
}