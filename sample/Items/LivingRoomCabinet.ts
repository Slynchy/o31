import {O31Item} from "../../engine/classes/O31Item";
import {TItemState} from "../../engine/types/TItemState";
import {TItemID} from "../../engine/types/TItemID";
import {KeyToKitchenDoor} from "./KeyToKitchenDoor";

export class LivingRoomCabinet extends O31Item {
    static id: string = "living_room_cabinet";
    canPickup: boolean = false;
    name: string = "Cabinet";
    size: number;
    weight: number;
    currentState: TItemState = "closed";

    onInspect(): void {
        o31.describe(`
The cabinet seems undisturbed and equally as dusty as the rest of the contents
of the room. It doesn't seem to be locked, and can be opened.
`, true);
    }

    onInteract(_verbs?: string[]): void {
        const _verb = _verbs[0];
        if(
            !_verb ||
            !(_verb === "open" ||
            _verb === "close")
        ) {
            o31.describe("Please specify what you want to do to the cabinet.", true);
        } else {
            if(_verb === "open") {
                o31.describe(`
You open the cabinet with a cutting creak, unsettling the dust around its hinges.
Inside is completely empty, save for a single skeleton key resting almost purposefully
on the shelf interior.`
                );
                o31.currentScene.addItem(
                    KeyToKitchenDoor.id,
                    true,
                    true
                );
            } else if(_verb === "close") {
                o31.currentScene.removeItem(
                    KeyToKitchenDoor.id,
                    true,
                    true
                );
            }
        }
    }

    onPickup(): void {
    }

    onUse(_target: TItemID): void {
    }

    onUsedBy(_obj: TItemID): void {
    }

}