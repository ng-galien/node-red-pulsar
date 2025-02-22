// Mocha/Chai and related testing framework packages
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PulsarProducerConfig } from '../../src/PulsarDefinition';
import { ProducerConfig } from 'pulsar-client';
import { producerConfig } from '../../src/PulsarConfig';

describe('producerConfig', () => {
  const mockPulsarProducerConfig: PulsarProducerConfig = {
    clientNodeId: '',
    id: '',
    name: '',
    schemaNodeId: '',
    type: '',
    z: '',
    topic: 'test-topic',
    topicTypedInput: 'str',
    producerName: 'test-producer',
    sendTimeoutMs: '500',
    initialSequenceId: '1',
    maxPendingMessages: '100',
    maxPendingMessagesAcrossPartitions: '50',
    blockIfQueueFull: 'false',
    messageRoutingMode: 'RoundRobinDistribution',
    hashingScheme: 'Murmur3_32Hash',
    compressionType: 'Zlib',
    batchingEnabled: 'false',
    batchingMaxPublishDelayMs: '100',
    batchingMaxMessages: '5',
    properties: '',
    publicKeyPath: 'public-key-path',
    encryptionKey: 'key',
    cryptoFailureAction: 'FAIL',
    chunkingEnabled: 'false',
    accessMode: 'Shared',
  };

  it('should return a valid producer config', () => {
    const config: ProducerConfig = producerConfig(
      mockPulsarProducerConfig, (value) => value
    );
    expect(config).to.be.an('object');
    expect(config.topic).to.equal('test-topic');
    expect(config.producerName).to.equal('test-producer');
    expect(config.sendTimeoutMs).to.equal(500);
    expect(config.initialSequenceId).to.equal(1);
    expect(config.maxPendingMessages).to.equal(100);
    expect(config.maxPendingMessagesAcrossPartitions).to.equal(50);
    expect(config.blockIfQueueFull).to.be.false;
    expect(config.messageRoutingMode).to.equal('RoundRobinDistribution');
    expect(config.hashingScheme).to.equal('Murmur3_32Hash');
    expect(config.compressionType).to.equal('Zlib');
    expect(config.batchingEnabled).to.be.false;
    expect(config.batchingMaxPublishDelayMs).to.equal(100);
    expect(config.batchingMaxMessages).to.equal(5);
    expect(config.properties).to.be.undefined;
    expect(config.publicKeyPath).to.equal('public-key-path');
    expect(config.encryptionKey).to.equal('key');
    expect(config.cryptoFailureAction).to.equal('FAIL');
    expect(config.chunkingEnabled).to.be.false;
    expect(config.accessMode).to.equal('Shared');
  });
});
