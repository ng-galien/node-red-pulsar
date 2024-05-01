import { expect } from "chai";
import { parseMandatoryChoice } from "../../src/PulsarConfig";

type ChoiceType = 'a' | 'b' | 'c';

describe('parseMandatoryChoice', function() {
    it('should return the value if it is part of the provided choices', function() {
        const choices: ChoiceType[] = ['a', 'b', 'c'];
        const value: ChoiceType = 'b';
        expect(parseMandatoryChoice(choices, value)).to.equal(value);
    });

    it('should throw an error if the value is not part of the provided choices', function() {
        const choices: ChoiceType[] = ['a', 'b', 'c'];
        const value = 'z' as ChoiceType;
        expect(() => parseMandatoryChoice(choices, value)).to.throw('Missing mandatory choice value');
    });

    it('should throw an error if the value is missing', function() {
        const choices: ChoiceType[] = ['a', 'b', 'c'];
        expect(() => parseMandatoryChoice(choices)).to.throw('Missing mandatory choice value');
    });

    it('should throw an error if the set of choices is empty', function() {
        const choices: ChoiceType[] = [];
        const value: ChoiceType = 'a';
        expect(() => parseMandatoryChoice(choices, value)).to.throw('Missing mandatory choice value');
    });
});
