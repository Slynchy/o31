import {removeArticles} from "./removeArticles";

const natural = require("natural");
const stopWords = ['a', 'the', 'and', 'of', 'in', 'to', 'is'];

export function preprocessText(text): string {
    // Tokenize and convert to lowercase
    let tokens = new natural.WordTokenizer().tokenize(text.toLowerCase());

    // Remove stop words
    // tokens = tokens.filter(token => !stopWords.includes(token));

    const stemmer = natural.PorterStemmer;
    // Apply stemming
    tokens = tokens.map(token => stemmer.stem(token));

    return tokens;
    // return removeArticles(text.toLowerCase());
}