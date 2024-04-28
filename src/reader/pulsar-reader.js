// @ts-check
/// <reference types="pulsar-client" />
const Pulsar = require('pulsar-client');
const uuid = require('uuid');

/**
 *
 * @param properties
 * @param RED
 * @param node
 * @returns {Pulsar.ClientConfig}
 */
function propertiesToConsumerConfig(properties, RED, node) {
    const result = {};
    if (properties.topic) {
        result.topic = RED.util.evaluateNodeProperty(properties.topic, "str", node);
    }
    if (properties.topics) {
        result.topics = RED.util.evaluateNodeProperty(properties.topics, "str", node);
    }
    if (properties.topicsPattern) {
        result.topicsPattern = RED.util.evaluateNodeProperty(properties.topicsPattern, "str", node);
    }

    result.subscription = RED.util.evaluateNodeProperty(properties.subscription, "str", node) || 'consumer-'+uuid.v4();

    if (properties.subscriptionType) {
        result.subscriptionType = RED.util.evaluateNodeProperty(properties.subscriptionType, "str", node);
    }
    if (properties.subscriptionInitialPosition) {
        result.subscriptionInitialPosition = RED.util.evaluateNodeProperty(properties.subscriptionInitialPosition, "str", node);
    }
    if (properties.ackTimeoutMs) {
        result.ackTimeoutMs = RED.util.evaluateNodeProperty(properties.ackTimeoutMs, "num", node);
    }
    if (properties.nAckRedeliverTimeoutMs) {
        result.nAckRedeliverTimeoutMs = RED.util.evaluateNodeProperty(properties.nAckRedeliverTimeoutMs, "num", node);
    }
    if (properties.receiverQueueSize) {
        result.receiverQueueSize = RED.util.evaluateNodeProperty(properties.receiverQueueSize, "num", node);
    }
    if (properties.receiverQueueSizeAcrossPartitions) {
        result.receiverQueueSizeAcrossPartitions = RED.util.evaluateNodeProperty(properties.receiverQueueSizeAcrossPartitions, "num", node);
    }

    result.consumerName = RED.util.evaluateNodeProperty(properties.consumerName, "str", node) || 'consumer-'+uuid.v4();

    if (properties.properties) {
        result.properties = RED.util.evaluateNodeProperty(properties.properties, "json", node);
    }
    if (properties.readCompacted) {
        result.readCompacted = RED.util.evaluateNodeProperty(properties.readCompacted, "bool", node);
    }
    if (properties.privateKeyPath) {
        result.privateKeyPath = RED.util.evaluateNodeProperty(properties.privateKeyPath, "str", node);
    }
    if (properties.cryptoFailureAction) {
        result.cryptoFailureAction = RED.util.evaluateNodeProperty(properties.cryptoFailureAction, "str", node);
    }
    if (properties.maxPendingChunkedMessage) {
        result.maxPendingChunkedMessage = RED.util.evaluateNodeProperty(properties.maxPendingChunkedMessage, "num", node);
    }
    if (properties.autoAckOldestChunkedMessageOnQueueFull) {
        result.autoAckOldestChunkedMessageOnQueueFull = RED.util.evaluateNodeProperty(properties.autoAckOldestChunkedMessageOnQueueFull, "num", node);
    }
    if (properties.batchIndexAckEnabled) {
        result.batchIndexAckEnabled = RED.util.evaluateNodeProperty(properties.batchIndexAckEnabled, "bool", node);
    }
    if (properties.regexSubscriptionMode) {
        result.regexSubscriptionMode = RED.util.evaluateNodeProperty(properties.regexSubscriptionMode, "str", node);
    }
    if (properties.deadLetterPolicy) {
        result.deadLetterPolicy = RED.util.evaluateNodeProperty(properties.deadLetterPolicy, "str", node);
    }
    return result;
}

module.exports = function(RED) {
    function PulsarConsumer(properties) {
        RED.nodes.createNode(this, properties);
        const node = this;
        const readerConfig = propertiesToConsumerConfig(properties, RED, node);
        const schemaConfig = RED.nodes.getNode(properties.schema);
        if(schemaConfig && schemaConfig.schemaInfo) {
            readerConfig.schema = schemaConfig.schemaInfo;
        }

        readerConfig.listener = function (pulsarMessage, msgConsumer) {
            node.debug('Message received' + pulsarMessage);
            //if the buffer is empty, the message is not a json object
            const nodeMessage = {
                topic: pulsarMessage.getTopicName(),
                messageId: pulsarMessage.getMessageId().toString(),
                publishTime: pulsarMessage.getPublishTimestamp(),
                eventTime: pulsarMessage.getEventTimestamp(),
                redeliveryCount: pulsarMessage.getRedeliveryCount(),
                partitionKey: pulsarMessage.getPartitionKey(),
                properties: pulsarMessage.getProperties(),
            }
            const str = pulsarMessage.getData().toString();
            try {
                nodeMessage.payload = JSON.parse(str);
            } catch (e) {
                node.debug('Message is not a json object');
                nodeMessage.payload = str;
            }
            node.send([nodeMessage, null]);
            msgConsumer.acknowledge(pulsarMessage).then(r => {
                node.debug('Message acknowledged'+r);
            }).catch(e => {
                node.error('Error acknowledging message: ' + e);
                node.status({fill: "red", shape: "dot", text: "Ack error"});
            });
        }

        node.producerConfig = producerConfig;

        node.on('close', function(done) {
            if(node.consumer && node.consumer.isConnected()) {
                node.consumer.close().then(() => {
                    done();
                }).catch((e) => {
                    done(e);
                });
            } else {
                done();
            }
        });
        node.status({fill: "red", shape: "dot", text: "disconnected"});
        const configNode = RED.nodes.getNode(properties.config);
        if (!configNode) {
            node.error('Config node not found');
            node.status({fill: "red", shape: "dot", text: "Config node not found"});
            return;
        }
        const pulsarClient = configNode.client;
        if(!pulsarClient) {
            node.error('Client not created');
            node.status({fill: "red", shape: "dot", text: "Client not created"});
            return;
        }
        node.status({fill: "yellow", shape: "dot", text: "connecting"});

        pulsarClient.createReader(node.producerConfig).then(consumer => {
            node.consumer = consumer;
            node.debug('Consumer created');
            node.status({fill: "green", shape: "dot", text: "connected"});
            const message = {
                topic: 'pulsar',
                payload: {
                    type: 'consumer',
                    status: 'ready',
                    topic: node.producerConfig.topic,
                    subscription: node.producerConfig.subscription,
                    subscriptionType: node.producerConfig.subscriptionType,
                }
            };
            node.send([null, message]);

        }).catch(e => {
            node.error('Error creating consumer: ' + e);
            node.status({fill: "red", shape: "dot", text: "Connection error"});
        });

    }
    RED.nodes.registerType("pulsar-consumer",PulsarConsumer);
}
