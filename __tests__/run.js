const { Parser } = require("../src/Parser");

const parser = new Parser();
const assert = require('assert');

/**
 * Lists of tests
 */
const tests = [require("./literals_test.js"), require("./statement_list_test.js")];





function test(program, expected){
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

// Run all tests
tests.forEach(testRun => testRun(test))


console.log("All assertions passed!")