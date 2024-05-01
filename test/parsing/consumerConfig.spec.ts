import {expect} from 'chai';
import {consumerConfig} from '../../src/PulsarConfig';
import {PulsarConsumerConfig} from "../../src/PulsarDefinition";

describe('consumerConfig', () => {
    it('should generate a valid ConsumerConfig object given a PulsarConsumerConfig', () => {
        const mockPulsarConsumerConfig: PulsarConsumerConfig = {
            clientNodeId: "", id: "", name: "", schemaNodeId: "", type: "", z: "",
            topic: 'test-topic',
            subscription: undefined,
            subscriptionType: 'Exclusive',
            subscriptionInitialPosition: 'Latest',
            ackTimeoutMs: "3000",
            nAckRedeliverTimeoutMs: "4000",
            receiverQueueSize: "10",
            receiverQueueSizeAcrossPartitions: "5",
            consumerName: 'test-consumer',
            properties: undefined,
            readCompacted: "true",
            privateKeyPath: 'path/to/privateKey',
            cryptoFailureAction: 'FAIL',
            maxPendingChunkedMessage: "10",
            autoAckOldestChunkedMessageOnQueueFull: "5",
            batchIndexAckEnabled: "true",
            regexSubscriptionMode: 'AllTopics',
            deadLetterPolicy: undefined,
            batchReceivePolicy: undefined
        };

        const config = consumerConfig(mockPulsarConsumerConfig);
        expect(config).to.be.an('object');
        expect(config.topic).to.equal('test-topic');
        expect(config.topics).to.be.undefined;
        expect(config.topicsPattern).to.be.undefined;
        expect(config.subscription).not.to.be.undefined;
        expect(config.subscriptionType).to.equal('Exclusive');
        expect(config.subscriptionInitialPosition).to.equal('Latest');
        expect(config.ackTimeoutMs).to.equal(3000);
        expect(config.nAckRedeliverTimeoutMs).to.equal(4000);
        expect(config.receiverQueueSize).to.equal(10);
        expect(config.receiverQueueSizeAcrossPartitions).to.equal(5);
        expect(config.consumerName).to.equal('test-consumer');
        expect(config.properties).to.be.undefined;
        expect(config.readCompacted).to.be.true;
        expect(config.privateKeyPath).to.equal('path/to/privateKey');
        expect(config.cryptoFailureAction).to.equal('FAIL');
        expect(config.maxPendingChunkedMessage).to.equal(10);
        expect(config.autoAckOldestChunkedMessageOnQueueFull).to.equal(5);
        expect(config.batchIndexAckEnabled).to.be.true;
        expect(config.regexSubscriptionMode).to.equal('AllTopics');
        expect(config.deadLetterPolicy).to.be.undefined;
        expect(config.batchReceivePolicy).to.be.undefined;
    });
});
