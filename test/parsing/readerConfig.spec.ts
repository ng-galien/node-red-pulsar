import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PulsarReaderConfig } from '../../src/PulsarDefinition';
import { MessageId, ReaderConfig } from 'pulsar-client';
import { readerConfig } from '../../src/PulsarConfig';
import { Node } from 'node-red';

describe('readerConfig', function () {
    it('should correctly configure reader with given config', function () {
        const node = {} as Node<{}>;
        const mockPulsarReaderConfig: PulsarReaderConfig = {
            clientNodeId: '',
            schemaNodeId: '',
            z: '',
            id: 'node-red',
            type: 'pulsar-reader',
            name: 'test-node',
            startMessage: 'Latest',
            topic: 'test-topic',
            topicTypedInput: 'str',
            receiverQueueSize: '200',
            readerName: 'test-reader',
            subscriptionRolePrefix: 'test-role',
            readCompacted: 'true',
            privateKeyPath: '/path/to/key',
            cryptoFailureAction: 'FAIL',
        };
        const config: ReaderConfig = readerConfig(node, mockPulsarReaderConfig);
        expect(config).to.be.an('object');
        expect(config.startMessageId).is.instanceof(MessageId);
        expect(config.topic).to.equal('test-topic');
        expect(config.receiverQueueSize).to.equal(200);
        expect(config.readerName).to.equal('test-reader');
        expect(config.subscriptionRolePrefix).to.equal('test-role');
        expect(config.readCompacted).to.be.true;
        expect(config.privateKeyPath).to.equal('/path/to/key');
        expect(config.cryptoFailureAction).to.equal('FAIL');
    });
});
