// Import required dependencies
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseNonEmptyObject } from '../../src/PulsarConfig';

describe('PulsarConfig', () => {
    describe('.parseNonEmptyObject()', () => {
        it('Should return undefined when value is empty or undefined', () => {
            const result = parseNonEmptyObject('');
            expect(result).to.be.undefined;
        });

        it('Should return undefined when value is not a JSON object', () => {
            const result = parseNonEmptyObject('not a JSON');
            expect(result).to.be.undefined;
        });

        it('Should return undefined when value is an array', () => {
            const result = parseNonEmptyObject('[]');
            expect(result).to.be.undefined;
        });

        it('Should return undefined when value is an array', () => {
            const result = parseNonEmptyObject('{}');
            expect(result).to.be.undefined;
        });

        it('Should return the string of the object when value is a non-empty object', () => {
            const expectedObject = '{"key":"value"}';
            const result = parseNonEmptyObject(expectedObject);
            expect(result).to.be.equal(expectedObject);
        });
    });
});
