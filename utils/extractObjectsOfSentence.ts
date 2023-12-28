import {removeArticles} from "./removeArticles";

const nlp = require("compromise");

/**
 *
 * @param _str
 * @returns null if no nouns detected, otherwise returns the nouns in lowercase
 */
export function extractObjectsOfSentence(_str: string): string[] {
    const nouns = nlp(_str).nouns().out('array');
    if(nouns.length == 0) {
        return null;
    }
    return nouns.map((e) => removeArticles(e).toLowerCase());
}