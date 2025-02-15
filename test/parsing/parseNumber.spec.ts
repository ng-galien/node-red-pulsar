// Importing the necessary modules
import { parseNumber } from '../../src/PulsarConfig';
import { expect } from 'chai';

// The describe() method of the Mocha Test Framework is being used to group related tests
// Writing a description for the function being tested
describe('parseNumber', function () {
  // Test 1: for a valid number as a string
  // Using the it() method to define a test case
  it('should correctly parse a string representation of a number into a number', function () {
    const inputValue = '5';
    const expectedValue = 5;
    // using the expect() method of the chai library to write the test assertions
    expect(parseNumber(inputValue)).to.equal(expectedValue);
  });

  // Test 2: for an invalid number string
  it('should return undefined for an invalid number string', function () {
    const inputValue = 'hello';
    const result = parseNumber(inputValue);
    expect(result).to.be.undefined;
  });

  // Test 3: for undefined input
  it('should return undefined for undefined input', function () {
    expect(parseNumber(undefined)).to.be.undefined;
  });
});
