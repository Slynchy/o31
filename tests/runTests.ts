import {testIntentFunc} from "../utils/testIntentFunc";

const args = process.argv.slice(2);
const verbose = args.indexOf("-v") !== -1 || args.indexOf("--verbose") !== -1;

console.log(`
test1 - ${testIntentFunc(
    "I open the front door",
    "interact",
    "front door",
    verbose
).result ? "pass" : "fail"}
test2 - ${testIntentFunc(
    "run to the attic",
    "move_to",
    "attic",
    verbose
).result ? "pass" : "fail"}
test3 - ${testIntentFunc(
    "pick up the gun",
    "pick_up",
    "gun",
    verbose
).result ? "pass" : "fail"}
test4 - ${testIntentFunc(
    "move to the kitchen",
    "move_to",
    "kitchen",
    verbose
).result ? "pass" : "fail"}
`);