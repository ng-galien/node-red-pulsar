import { assert } from 'chai';
import { consumerConfig } from '../../src/PulsarConfig';
import {PulsarConsumerConfig} from "../../src/PulsarDefinition";

describe('consumerConfig', () => {
  it('should generate a valid ConsumerConfig object given a PulsarConsumerConfig', () => {
    const testConfig: PulsarConsumerConfig = {
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
      regexSubscriptionMode: 'AllowPatternBasedSubscription',
      deadLetterPolicy: undefined,
      batchReceivePolicy: undefined
    };

    const actualConsumerConfig = consumerConfig(testConfig);

    assert.isObject(actualConsumerConfig);
    assert.hasAnyKeys(actualConsumerConfig, ['topic', 'topics', 'topicsPattern']);
    assert.isString(actualConsumerConfig.topic);
    assert.isString(actualConsumerConfig.subscription);
    assert.isNumber(actualConsumerConfig.ackTimeoutMs);
    assert.isNumber(actualConsumerConfig.nAckRedeliverTimeoutMs);
    assert.isNumber(actualConsumerConfig.receiverQueueSize);
    assert.isNumber(actualConsumerConfig.receiverQueueSizeAcrossPartitions);
    assert.isNumber(actualConsumerConfig.maxPendingChunkedMessage);
    assert.isNumber(actualConsumerConfig.autoAckOldestChunkedMessageOnQueueFull);
    assert.isTrue(actualConsumerConfig.readCompacted);
    assert.isTrue(actualConsumerConfig.batchIndexAckEnabled);
  });
});
