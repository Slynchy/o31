const nlp = require("compromise");
import {removeArticles} from "./removeArticles";

export function extractVerbsOfSentence(_str: string): string[] {
    const verbs = nlp(_str).verbs().out('array');
    if(verbs.length == 0) {
        return null;
    }
    return verbs.map((e) => removeArticles(e).toLowerCase());
}