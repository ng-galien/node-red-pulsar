import { parseTopic } from '../../src/PulsarConfig';
import { expect } from 'chai';
import 'mocha';

describe('parseTopic', () => {
    it('should throw an error if the topic is unidentified or empty', () => {
        expect(() => parseTopic('')).to.throw('Missing mandatory topic value');
        // @ts-ignore
        expect(() => parseTopic(undefined)).to.throw(
            'Missing mandatory topic value',
        );
    });

    it('should return a list topic when there are multiple topics separated by ";" and trim them', () => {
        expect(parseTopic(' topic1 ; topic2 ')).to.eql({
            list: ['topic1', 'topic2'],
        });
    });

    it('should throw an error if all topics are empty in the list', () => {
        expect(() => parseTopic(';;')).to.throw(
            'Missing mandatory topic value',
        );
    });

    it('should return a pattern topic when topic contains "*"', () => {
        expect(parseTopic(' topic* ')).to.eql({ pattern: 'topic*' });
    });

    it('should return a single topic when topic is a single word', () => {
        expect(parseTopic(' topic ')).to.eql({ single: 'topic' });
    });
});
