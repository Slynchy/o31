import {TItemID} from "./TItemID";

export type TInventory = Record<TItemID, {
    quantity: number;
    inspectCount: number;
}>;