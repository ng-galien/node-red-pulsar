const uuid = require('uuid');
const propUtils = require('../properties-util');


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

        node.on('close', function(done) {
            if (node.producer && node.producer.isConnected()) {
                node.producer.close().then(() => {
                    done();
                }).catch((e) => {
                    done(e);
                });
            } else {
                done();
            }
        });
        node.status({fill: "red", shape: "dot", text: "disconnected"});

        var configNode = RED.nodes.getNode(properties.config);
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
