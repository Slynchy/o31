import {BayesClassifier} from "natural";
const fs = require("fs");
const natural = require("natural");
const path = require("path");

export function loadClassifierForTests(_modelPath?: string): BayesClassifier {
    const serializedClassifier =
        fs.readFileSync(path.resolve(_modelPath || "./model.json"));
    const deserializedClassifier =
        natural.BayesClassifier.restore(JSON.parse(serializedClassifier));

    return deserializedClassifier;
}