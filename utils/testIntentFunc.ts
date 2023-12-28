import {loadClassifierForTests} from "./loadClassifierForTests";
import {extractLastObjectOfSentence} from "./extractLastObjectOfSentence";
import {logVerbose} from "./logVerbose";

export function testIntentFunc(
    input: string,
    expectedOutput: string,
    expectedObject: string,
    _verbose?: boolean
) {
    let output: string = "";
    let object: string = "";
    const errors: any[] = [];

    try {
        const deserializedClassifier = loadClassifierForTests();
        output =
            deserializedClassifier.classify(input);
        object =
            extractLastObjectOfSentence(input);
        logVerbose(
            _verbose, input,
            object, output
        );
    } catch(err) {
        errors.push(err);
        if(_verbose) {
            console.error(err);
        }
    }

    return {
        result: (
            output == expectedOutput &&
            object == expectedObject
        ),
        errors: errors
    }
}