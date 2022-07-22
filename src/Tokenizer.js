/**
 * Tokenizer sprc.
 */
const Spec = [
    // skip white space
    [/^\s+/, null],

    //------------ skip comments
    // single line comments
    [/^\/\/.*/, null],

    // multiline comments
    [/^\/\*[\s\S]*?\*\//, null],

    // semicolon
    [/^;/, ";"],
    // number
    [/^\d+/, "NUMBER"],

    // strings
    [/^"[^"]*"/, "STRING"],
    [/^'[^']*'/, "STRING"]
];


/**
 * Tokenizer
 * 
 * Lazily pulls a tokenizer from a Stream
 */

class Tokenizer {
    /**
    * Initializes the string
    */
    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    /**  
    * whether we still have more tokens
    */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    /**
     * Whether the tokenizer reached EOF
     */
    isEOF() {
        return this._cursor === this._string.length;
    }

    /**
     * Obtains next tokens
     */
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }

        const string = this._string.slice(this._cursor);

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);

            // could not match this rule, continue
            if (tokenValue == null) {
                continue;
            }

            if (tokenType == null) {
                return this.getNextToken();
            }
            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected Token: "${string[0]}"`);
    }

    _match(regexp, string) {
        const matched = regexp.exec(string);
        if (matched == null) {
            return null;
        }

        this._cursor += matched[0].length;
        return matched[0];
    }
}

module.exports = {
    Tokenizer,
}