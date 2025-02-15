// Mocha/Chai and related testing framework packages
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PulsarClientConfig } from '../../src/PulsarDefinition';
import { ClientConfig } from 'pulsar-client';
import { clientConfig } from '../../src/PulsarConfig';
import { Node } from 'node-red';

describe('clientConfig', () => {
  const node = {} as Node;
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
      node,
      undefined,
      mockPulsarClientConfig,
    );
    expect(config).to.be.an('object');
    expect(config.serviceUrl).to.equal('pulsar://localhost:6650');
  });
});
