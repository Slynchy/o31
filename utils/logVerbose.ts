export function logVerbose(
    _verbose: boolean,
    input: string,
    object: string,
    output: string
): void {
    if(_verbose) {
        console.log(`
Input: "${input}"
Nouns: "${object}"
Output: "${output}"    
`);
    }
}