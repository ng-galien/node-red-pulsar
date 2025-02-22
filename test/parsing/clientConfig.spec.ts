// Mocha/Chai and related testing framework packages
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PulsarClientConfig } from '../../src/PulsarDefinition';
import { ClientConfig } from 'pulsar-client';
import { clientConfig, validatePulsarUrl } from '../../src/PulsarConfig';

describe('clientConfig', () => {
  const mockPulsarClientConfig: PulsarClientConfig = {
    id: '',
    name: '',
    type: '',
    z: '',
    authenticationNodeId: '',
    serviceUrl: 'pulsar://localhost:6650',
    serviceUrlTypedInput: 'str',
  };

  it('should return a valid producer config', () => {
    const config: ClientConfig = clientConfig(
      undefined,
      mockPulsarClientConfig,
      (value) => value,
    );
    expect(config).to.be.an('object');
    expect(config.serviceUrl).to.equal('pulsar://localhost:6650');
  });

  it('pulsar url should be valid', () => {
    expect(validatePulsarUrl('pulsar://localhost:6650')).to.equal(true);
    expect(validatePulsarUrl('pulsar+ssl://localhost:6651')).to.equal(true);
    expect(validatePulsarUrl('')).to.equal(false);
    expect(validatePulsarUrl('this is not a valid url')).to.equal(false);
    expect(validatePulsarUrl('http://localhost:8080')).to.equal(false);
  });
});
