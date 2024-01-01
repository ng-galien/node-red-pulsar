const uuid = require('uuid');
const propUtils = require('./properties-util');

function propertiesToProducerConfig(properties) {
    const result = {};
    if (!properties.topic) {
        throw new Error('Topic is required');
    }
    result.topic = properties.topic;
    result.producerName = properties.producerName || 'producer-'+uuid.v4();
    if(propUtils.isPositiveNumber(properties.sendTimeoutMs)) {
        result.sendTimeoutMs = properties.sendTimeoutMs;
    }
    if(propUtils.isNumber(properties.initialSequenceId)) {
        result.initialSequenceId = properties.initialSequenceId;
    }
    if(propUtils.isNumber(properties.maxPendingMessages)) {
        result.maxPendingMessages = properties.maxPendingMessages;
    }
    if(propUtils.isPositiveNumber(properties.maxPendingMessagesAcrossPartitions)) {
        result.maxPendingMessagesAcrossPartitions = properties.maxPendingMessagesAcrossPartitions;
    }
    if(propUtils.isBoolean(properties.blockIfQueueFull)) {
        result.blockIfQueueFull = properties.blockIfQueueFull;
    }
    if(propUtils.isNonEmptyString(properties.messageRoutingMode)) {
        result.messageRoutingMode = properties.messageRoutingMode;
    }
    if(propUtils.isNonEmptyString(properties.hashingScheme)) {
        result.hashingScheme = properties.hashingScheme;
    }
    if(propUtils.isNonEmptyString(properties.compressionType)) {
        result.compressionType = properties.compressionType;
    }
    if(propUtils.isBoolean(properties.batchingEnabled)) {
        result.batchingEnabled = properties.batchingEnabled;
    }
    if(propUtils.isPositiveNumber(properties.batchingMaxPublishDelayMs)) {
        result.batchingMaxPublishDelayMs = properties.batchingMaxPublishDelayMs;
    }
    if(propUtils.isPositiveNumber(properties.batchingMaxMessages)) {
        result.batchingMaxMessages = properties.batchingMaxMessages;
    }
    if(propUtils.isObject(properties.properties)) {
        result.properties = properties.properties;
    }
    if(propUtils.isNonEmptyString(properties.publicKeyPath)) {
        result.publicKeyPath = properties.publicKeyPath;
    }
    if(propUtils.isNonEmptyString(properties.encryptionKey)) {
        result.encryptionKey = properties.encryptionKey;
    }
    if(propUtils.isNonEmptyString(properties.cryptoFailureAction)) {
        result.cryptoFailureAction = properties.cryptoFailureAction;
    }
    if(propUtils.isBoolean(properties.chunkingEnabled)) {
        result.chunkingEnabled = properties.chunkingEnabled;
    }
    if(propUtils.isNonEmptyString(properties.accessMode)) {
        result.accessMode = properties.accessMode;
    }
    return result;
}

module.exports = function (RED) {
    function PulsarProducer(properties) {
        RED.nodes.createNode(this, properties);
        const node = this;
        const producerConfig = propertiesToProducerConfig(properties);
        const schemaConfig = RED.nodes.getNode(properties.schema);
        if(schemaConfig && schemaConfig.schemaInfo) {
            producerConfig.schema = schemaConfig.schemaInfo;
        }
        node.producerConfig = producerConfig;

        node.on('close', function() {
            node.producer && node.producer.close();
        });
        node.status({fill: "red", shape: "dot", text: "disconnected"});

        // Retrieve the config node
        const pulsarClient = RED.nodes.getNode(properties.config).client;

        if(!pulsarClient) {
            node.error('Client not created');
            node.status({fill: "red", shape: "dot", text: "Client not created"});
            return;
        }
        node.status({fill: "yellow", shape: "dot", text: "connecting"});

        pulsarClient.createProducer(node.producerConfig).then(producer => {
            node.debug('Producer created');
            node.producer = producer;
            node.status({fill: "green", shape: "dot", text: "connected"});
            const message = {
                topic: 'pulsar',
                payload: {
                    type: 'producer',
                    status: 'ready',
                    topic: node.producerConfig.topic,
                    producerName: node.producerConfig.producerName
                }
            };
            node.send(message);
        }).catch(e => {
            node.error('Error creating producer: ' + e);
            node.status({fill: "red", shape: "dot", text: "Connection error"});
        });

        node.on('input', function (msg, send, done) {
            const self = this;
            if (self.producer) {
                self.status({fill: "orange", shape: "dot", text: "message received"});
                self.debug('Message received');
                if (!msg.payload) {
                    self.warn('Payload is empty');
                    self.status({fill: "orange", shape: "dot", text: "Payload is empty"});
                    return;
                }
                const str = JSON.stringify(msg.payload);
                const buffer = Buffer.from(str);
                self.producer.send({
                    data: buffer
                }).then(r => {
                    self.status({fill: "green", shape: "dot", text: "connected"});
                }).catch(e => {
                    self.error('Error sending message: ' + e);
                    self.status({fill: "red", shape: "dot", text: "Send error"});
                });
            } else {
                self.error('Producer not created');
                self.status({fill: "red", shape: "dot", text: "Producer not created"});
            }
            if (done) {
                done();
            }
        });
    }

    RED.nodes.registerType("pulsar-producer", PulsarProducer);
}