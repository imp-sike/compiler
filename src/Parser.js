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
     *  : StatementList
     *  ;
     */
    Program() {
        return {
            type: 'Program',
            body: this.StatementList()
        };
    }

    /**
     * StatementList
     *  : Statement
     *  : StatementList Statement -> Statement Statement Statement Statement 
     *  ;
     */
    StatementList(stoplookahead = null) {
        const statementList = [this.Statement()];

        while (this._lookahead != null && this._lookahead.type != stoplookahead) {
            statementList.push(this.Statement());
        }
        return statementList;
    }


    /**
     * Statement
     *  : ExpressionStatement
     *  | BlockStatement
     *  | EmptyStatement
     *  ;
     */
    Statement() {
        switch (this._lookahead.type) {
            case ';':
                return this.EmptyStatement();
            case '{':
                return this.BlockStatement();
            default:
                return this.ExpressionStatement();
        }
    }

    /**
     * EmptyStatement
     * : ;
     * ;
     */
    EmptyStatement() {
        this._eat(";");
        return {
            type: 'EmptyStatement',
        };
    }

    /**
     * BlockStatement
     * : '{' OptStatementList '}'
     * ;
     */
    BlockStatement() {
        this._eat("{");

        const body = this._lookahead.type !== '}' ? this.StatementList("}") : [];
        this._eat("}");
        return {
            type: 'BlockStatement',
            body,
        };
    }




    /**
     * ExpressionStatement
     * : Expression ';'
     */
    ExpressionStatement() {
        const expression = this.Expression()
        this._eat(';');
        return {
            type: 'ExpressionStatement',
            expression
        };

    }



    /**
     * AdditiveExpression
     * : MultiplicativeExpression
     * | AdditiveExpression ADDITIVE_OPERATOR Literal
     * ;
     */
    AdditiveExpression() {
        return this._BinaryExpression('PrimaryExpression', 'ADDITIVE_OPERATOR');
    }

    /**
     * MultiplicativeExpression
     * : PrimaryExpression
     * | AdditiveExpression MULTIPLICATIVE_OPERATOR Literal
     * ;
     */
    MultiplicativeExpression() {
        return this._BinaryExpression('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR');
    }

    /**
     * Generic Binary Expression
     */
    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();
        while (this._lookahead.type === operatorToken) {
            // operator +,-
            const operator = this._eat(operatorToken).value;
            const right = this[builderName]();

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right,
            };
        }

        return left;
    }


    /**
     * PrimaryExpression
     * : Literal
     * | ParenthizedExpression
     * ;
     */
    PrimaryExpression() {
        switch (this._lookahead.type) {
            case '(':
                return this.ParenthizedExpression();
            default:
                return this.Literal();
        }
    }

    /**
     * ParenthizedExpression
     * : '(' Expression ')'
     * ;
     */
    ParenthizedExpression() {
        this._eat('(');
        const expression = this.Expression();
        this._eat(')');
        return expression;
    }

    /** 
     * Expression
     * : Literal
     * ;
     */
    Expression() {
        return this.AdditiveExpression();
    }


    /**
     * Literal
     * : NumericLiteral
     * | StringLiteral
     * ;
     */
    Literal() {
        switch (this._lookahead.type) {
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