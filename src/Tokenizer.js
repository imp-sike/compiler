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
    if(!this.hasMoreTokens()) {
        return null;
    }

    const string = this._string.slice(this._cursor);
    if(!Number.isNaN(Number(string[0]))) {
        let number = '';
        while(!Number.isNaN(Number(string[this._cursor]))) {
            number += string[this._cursor++];
        }
        return {
            "type": 'NUMBER',
            value: number,
        };
    }

    if(string[0] === '"') {
        let s = '';
        do {
            s += this._string[this._cursor++];
        } while(string[this._cursor]  !== '"' && !this.isEOF());

        s += this._cursor++; // skip  "
        return {
            "type": "STRING",
            "value": s,
        };

    }

    return null;
   }

}

module.exports = {
    Tokenizer,
}