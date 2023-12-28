import {O31} from "../engine/O31";
import * as fs from "fs";
import * as readline from "readline";
import {Computer} from "../sample/Items/Computer";
import {DoorToKitchen} from "../sample/Items/DoorToKitchen";
import {KeyToKitchenDoor} from "../sample/Items/KeyToKitchenDoor";
import {Kitchen} from "../sample/Scenes/Kitchen";
import {LivingRoom} from "../sample/Scenes/LivingRoom";
import {LivingRoomCabinet} from "../sample/Items/LivingRoomCabinet";

function o31RuntimeTest() {
    const instance: O31 = new O31(
        fs.readFileSync("./model.json", "utf8"),
        false
    );
    instance.initialize(
        [Computer, DoorToKitchen, KeyToKitchenDoor, LivingRoomCabinet],
        [Kitchen, LivingRoom],
        {
            activeScene: LivingRoom.id,
            elapsedTime: 0,
            inventory: {},
            playerState: {health: 100, maxHealth: 100, maxSanity: 100, sanity: 100},
            previousScene: "",
            sceneStateMap: {},
            seenStates: {}
        }
    );
    instance.describe(`
You awake with a start, sharply rising at the hip from the sofa you find 
yourself atop, the dusty air prompting a violent cough from deep in
your lungs. The room is dark, and cold. How you got here is of great 
wonder, but how you get out is of even greater wonder- no, of urgency.

As you rub your likely-bloodshot eyes, you should probably look around. 
`);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const onInput = (_input: string) => {
        console.clear();
        // console.log("\n================\n");
        instance.input(_input);
        console.log(instance.descriptionBuffer);
        ask();
    };
    const ask = () => {
        rl.question("> ", onInput);
    }
    console.log(instance.descriptionBuffer);
    ask();
}

o31RuntimeTest();