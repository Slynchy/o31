import {preprocessText} from "./utils/preprocessText";

const natural = require("natural");
const fs = require("fs");

const classifier = new natural.BayesClassifier();

console.log("Loading training data...");

let trainingData: string[][] = [];
const trainingFiles: string[] =
    fs.readdirSync("./training_data")
        .map((s: string) => "./training_data/" + s);
trainingFiles.forEach((path) => {
    const buffer = fs.readFileSync(path, "utf8");
    const parsedBuffer: string[][] = JSON.parse(buffer);
    trainingData.push(...parsedBuffer);
});

console.log("Adding training data to classifier...");

trainingData.forEach((data) => {
    classifier.addDocument(
        preprocessText(data[0]),
        data[1]
    );
});

console.log("Training model...");

classifier.train();

console.log("Writing model to disk...");
const serializedClassifier = JSON.stringify(classifier);
fs.writeFileSync("./model.json", serializedClassifier, "utf8");
console.log("Done!");