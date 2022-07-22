/**
 * Letter parser: recursive descent impl.
 */


const { Tokenizer } = require("./Tokenizer");

class Parser {
    /**
     * Initializes the Tokenizer
     */

    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
    }


    /**
     * Parses a string to an AST
     */
    parse(string) {
        this._string = string;
        this._tokenizer.init(this._string);

        // Prime the Tokenizer to obtain the first
        // token which is our lookahead.
        //  The lookahead is used for predictive parshing
        this._lookahead = this._tokenizer.getNextToken()


        // Parse recursively starting from the main
        // entry point, the Program.
        return this.Program();
    }

    /**
     * Main Entry Point
     * 
     * Program
     *  : Literal
     *  ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.Literal()
        };
    }


    /**
     * Literal
     * : NumericLiteral
     * | StringLiteral
     * ;
     */
    Literal() {
        switch(this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral();
            case 'STRING':
                return this.StringLiteral();
        }
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }

    /**
     * NumericLiteral
     *  : NUMBER
     *  ;
     */
    NumericLiteral() {
        const token = this._eat('NUMBER');
        return {
            type: 'NumericLiteral',
            value: Number(token.value),
        };
    }



    /**
     * StringLiteral
     *  : STRING
     *  ;
     */
     StringLiteral() {
        const token = this._eat('STRING');
        return {
            type: 'StringLiteral',
            value: token.value.slice(1, -1),
        };
    }


    _eat(tokenType) {
        const token = this._lookahead;

        if (token === null) {
            throw new SyntaxError(
                `Unexpected end of input, expected "${this.tokenType}"`
            );
        }



        if (token.type !== tokenType) {
            throw new SyntaxError(
                `Unexpected end of input, expected "${this.tokenType}"`
            );
        }

        // advance to next token 
        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}


module.exports = {
    Parser,
};