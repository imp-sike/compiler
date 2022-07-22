/**
 * Letter parser: recursive descent impl.
 */

class Parser {
    /**
     * Parses a string to an AST
     */

    parse(string) {
        this._string = string;
        return this.Program();
    }

    /**
     * Main Entry Point
     * 
     * Program
     *  : NumericLiteral
     *  ;
     */
    Program() {
        return this.NumericLiteral();
    }

    NumericLiteral() {
        return {
            type: 'NumericLiteral',
            value: Number(this._string),
        };
    }
}


module.exports = {
    Parser,
};