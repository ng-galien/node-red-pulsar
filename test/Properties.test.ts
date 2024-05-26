import { expect } from 'chai';
import { jsonStringToProperties, Properties } from '../src/Properties';

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
            const invalidJson = "not a json string";
            const result = jsonStringToProperties(invalidJson);
            expect(result).to.be.undefined;
        });

        it('should skip non-string values in the JSON string', () => {
            const jsonWithNonStringValues = '{"key1": 1, "key2": true, "key3": "value3"}';
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

        it('should return undefined when JSON string is an array', () => {
            const result = jsonStringToProperties('[]');
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a String object', () => {
            const result = jsonStringToProperties("test");
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a Number object', () => {
            const result = jsonStringToProperties("123");
            expect(result).to.be.undefined;
        });

        it('should return undefined when JSON string is a Boolean object', () => {
            const result = jsonStringToProperties("true");
            expect(result).to.be.undefined;
        });
    });
});
