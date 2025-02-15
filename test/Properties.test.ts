import { expect } from 'chai';
import {
    jsonStringToProperties,
    anyToProperties,
    Properties,
    anyToNumber,
    anyToBoolean,
    anyToString,
    anyToStringArray,
} from '../src/Properties';

describe('Properties', () => {
    describe('jsonStringToProperties function', () => {
        /**
         * This function is responsible for converting a JSON string to a Properties object.
         * A Properties object is a simple key-value object where both key and value are strings.
         * If the function can't parse the JSON or if the JSON doesn't represent a valid Properties object, the function should return undefined.
         */

        it('should return a Properties object when given a valid JSON string', () => {
            const json = '{"key1": "value1", "key2": "value2"}';
            const expected: Properties = { key1: 'value1', key2: 'value2' };
            const result = jsonStringToProperties(json);
            expect(result).to.eql(expected);
        });

        it('should return undefined when given an invalid JSON string', () => {
            const invalidJson = 'not a json string';
            const result = jsonStringToProperties(invalidJson);
            expect(result).to.be.undefined;
        });

        it('should skip non-string values in the JSON string', () => {
            const jsonWithNonStringValues =
                '{"key1": 1, "key2": true, "key3": "value3"}';
            const expected: Properties = { key3: 'value3' };
            const result = jsonStringToProperties(jsonWithNonStringValues);
            expect(result).to.eql(expected);
        });

        it('should return undefined when JSON string is undefined', () => {
            const result = jsonStringToProperties(undefined);
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is empty', () => {
            const result = jsonStringToProperties('');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is empty object', () => {
            const result = jsonStringToProperties('{}');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is an array', () => {
            const result = jsonStringToProperties('[]');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a String object', () => {
            const result = jsonStringToProperties('test');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a Number object', () => {
            const result = jsonStringToProperties('123');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a Boolean object', () => {
            const result = jsonStringToProperties('true');
            expect(result).to.be.undefined;
        });
    });

    describe('anyToProperties function', () => {
        /**
         * This function is responsible for converting any object to a Properties object.
         * A Properties object is a simple key-value object where both key and value are strings.
         * If any key or value is not a string, the function converts it to a string.
         */

        it('should return a Properties object when given a valid object', () => {
            const obj = { key1: 'value1', key2: 'value2' };
            const expected: Properties = { key1: 'value1', key2: 'value2' };
            const result = anyToProperties(obj);
            expect(result).to.eql(expected);
        });

        it('should return a Properties object when given an object with non-string values', () => {
            const objWithNonStringValues = {
                key1: 1,
                key2: true,
                key3: 'value3',
            };
            const expected: Properties = {
                key1: '1',
                key2: 'true',
                key3: 'value3',
            };
            const result = anyToProperties(objWithNonStringValues);
            expect(result).to.eql(expected);
        });

        it('should return undefined when given a string', () => {
            const result = anyToProperties('test');
            expect(result).to.be.undefined;
        });

        it('should return undefined when given a number', () => {
            const result = anyToProperties(123);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given a boolean', () => {
            const result = anyToProperties(true);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given undefined', () => {
            const result = anyToProperties(undefined);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given null', () => {
            const result = anyToProperties(null);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an empty object', () => {
            const result = anyToProperties({});
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array', () => {
            const result = anyToProperties([]);
            expect(result).to.be.undefined;
        });
    });

    describe('anyToNumber function', () => {
        /**
         * This function is responsible for converting any object to a number.
         * If the object can't be converted to a number, the function should return undefined.
         */

        it('should return a number when given a number', () => {
            const num = 123;
            const result = anyToNumber(num);
            expect(result).to.eql(num);
        });

        it('should return a number when given a string that can be converted to a number', () => {
            const str = '123';
            const result = anyToNumber(str);
            expect(result).to.eql(123);
        });

        it("should return undefined when given a string that can't be converted to a number", () => {
            const str = 'not a number';
            const result = anyToNumber(str);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given a boolean', () => {
            const bool = true;
            const result = anyToNumber(bool);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given undefined', () => {
            const result = anyToNumber(undefined);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given null', () => {
            const result = anyToNumber(null);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an object', () => {
            const obj = { key: 'value' };
            const result = anyToNumber(obj);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array', () => {
            const arr = [1, 2, 3];
            const result = anyToNumber(arr);
            expect(result).to.be.undefined;
        });
    });

    describe('anyToBoolean function', () => {
        /**
         * This function is responsible for converting any object to a boolean.
         * If the object can't be converted to a boolean, the function should return undefined.
         */

        it('should return a boolean when given a boolean', () => {
            const bool = true;
            const result = anyToBoolean(bool);
            expect(result).to.eql(bool);
        });

        it('should return a boolean when given a string that can be converted to a boolean', () => {
            const str = 'true';
            const result = anyToBoolean(str);
            expect(result).to.eql(true);
        });

        it("should return undefined when given a string that can't be converted to a boolean", () => {
            const str = 'not a boolean';
            const result = anyToBoolean(str);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given a number', () => {
            const num = 123;
            const result = anyToBoolean(num);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given undefined', () => {
            const result = anyToBoolean(undefined);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given null', () => {
            const result = anyToBoolean(null);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an object', () => {
            const obj = { key: 'value' };
            const result = anyToBoolean(obj);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array', () => {
            const arr = [1, 2, 3];
            const result = anyToBoolean(arr);
            expect(result).to.be.undefined;
        });
    });

    describe('anyToString function', () => {
        /**
         * This function is responsible for converting any object to a string.
         * If the object can't be converted to a string, the function should return undefined.
         */

        it('should return a string when given a string', () => {
            const str = 'test';
            const result = anyToString(str);
            expect(result).to.eql(str);
        });

        it('should return a string when given a number', () => {
            const num = 123;
            const result = anyToString(num);
            expect(result).to.eql('123');
        });

        it('should return a string when given a boolean', () => {
            const bool = true;
            const result = anyToString(bool);
            expect(result).to.eql('true');
        });

        it('should return a string when given an object', () => {
            const obj = { key: 'value' };
            const result = anyToString(obj);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given undefined', () => {
            const result = anyToString(undefined);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given null', () => {
            const result = anyToString(null);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array', () => {
            const arr = [1, 2, 3];
            const result = anyToString(arr);
            expect(result).to.be.undefined;
        });
    });

    describe('anyToStringArray function', () => {
        /**
         * This function is responsible for converting any object to a string array.
         * If the object can't be converted to an array, return undefined.
         * If the object is an array, just return members of the array that are strings.
         */

        it('should return a string array when given an array of strings', () => {
            const arr = ['test', '123', 'true'];
            const result = anyToStringArray(arr);
            expect(result).to.eql(arr);
        });

        it('should return undefined when given an array of numbers', () => {
            const arr = [1, 2, 3];
            const result = anyToStringArray(arr);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array of booleans', () => {
            const arr = [true, false];
            const result = anyToStringArray(arr);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array of objects', () => {
            const arr = [{ key: 'value' }, { key: 'value' }];
            const result = anyToStringArray(arr);
            expect(result).to.be.undefined;
        });

        it('should return undefined when given an array of mixed types', () => {
            const arr = ['test', 123, true];
            const result = anyToStringArray(arr);
            const expected = ['test'];
            expect(result).to.eql(expected);
        });

        it('should return undefined when given a string', () => {
            const str = 'test';
            const result = anyToStringArray(str);
            expect(result).to.be.undefined;
        });
    });
});
