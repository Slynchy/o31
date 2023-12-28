export function removeArticles(input: string) {
    return input.replace(/^(the|a|an|some|any|'|")\s+/i, '');
}