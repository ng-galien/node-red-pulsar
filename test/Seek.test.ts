import { parseSeekPosition } from '../src/Seek';
import { expect } from 'chai';
import 'mocha';
import {MessageId} from "pulsar-client";

describe('parseSeekPosition function', () => {

  it('should return SeekPosition with Early Id and timestamp 0 when value is "Earliest"', () => {
    const result = parseSeekPosition('Earliest');
    expect(result).to.deep.equal({ id: MessageId.earliest(), timestamp: 0 });
  });

  it('should return SeekPosition with Latest Id and timestamp 0 when value is "Latest"', () => {
    const result = parseSeekPosition('Latest');
    expect(result).to.deep.equal({ id: MessageId.latest(), timestamp: 0 });
  });

  it('should return SeekPosition with earliest Id and the timestamp converted to a number when value is a number or can be converted to a number', () => {
    const result = parseSeekPosition('100');
    expect(result).to.deep.equal({ id: MessageId.earliest(), timestamp: 100 });
  });

  it('should return undefined when value is not valid', () => {
    const result = parseSeekPosition('Invalid');
    expect(result).to.be.undefined;
  });
});
