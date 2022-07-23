const { Parser } = require("../src/Parser");

const parser = new Parser();
const assert = require('assert');

/**
 * Lists of tests
 */
const tests = [require("./literals_test.js"),
require("./statement_list_test.js"),
require("./empty_statement_test.js"),
require("./math_test.js"),
require("./block_test.js"),];


function exec() {
    const program = `
    43+12*10;
    `;
    const ast = parser.parse(program);
    console.log(JSON.stringify(ast, null, 2));
}

exec();


function test(program, expected) {
    const ast = parser.parse(program);
    assert.deepEqual(ast, expected);
}

// Run all tests
tests.forEach(testRun => testRun(test))


console.log("All assertions passed!")