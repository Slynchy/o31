import {extractObjectsOfSentence} from "./extractObjectsOfSentence";

export function extractLastObjectOfSentence(_str: string) {
    const nouns = extractObjectsOfSentence(_str);
    return nouns[nouns.length - 1] || null;
}