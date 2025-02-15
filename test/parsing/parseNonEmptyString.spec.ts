import { parseNonEmptyString } from '../../src/PulsarConfig';
import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('parseNonEmptyString', function () {
    it('should return the value if the string is not empty', function () {
        const result = parseNonEmptyString('hello');
        expect(result).to.equal('hello');
    });

    it('should return undefined if the string is empty', function () {
        const result = parseNonEmptyString('');
        expect(result).to.be.undefined;
    });

    it('should return undefined if no value is provided', function () {
        const result = parseNonEmptyString(undefined);
        expect(result).to.be.undefined;
    });
});
