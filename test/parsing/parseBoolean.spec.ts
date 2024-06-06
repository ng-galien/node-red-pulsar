import { expect } from 'chai';
import {parseBoolean} from "../../src/PulsarConfig";

describe('parseBoolean', () => {
  /**
   * This function receives a string and tries to convert it to a boolean.
   * 'true' should return true, 'false' should return false, anything else should return undefined.
   */

  it('should return true when given "true"', () => {
    expect(parseBoolean('true')).to.be.true;
  });

  it('should return false when given "false"', () => {
    expect(parseBoolean('false')).to.be.false;
  });

  it('should return undefined when given a string other than "true" or "false"', () => {
    expect(parseBoolean('randomString')).to.be.undefined;
  });

  it('should return undefined when given an undefined value', () => {
    expect(parseBoolean()).to.be.undefined;
  });
});
