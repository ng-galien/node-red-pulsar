const Pulsar = require('pulsar-client');
const uuid = require('uuid');

module.exports = function (RED) {
    function PulsarProducer(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.status({fill: "red", shape: "dot", text: "disconnected"});
        node.topic = config.topic;
        node.producerName = config.name || 'producer-'+uuid.v4();
        // Retrieve the config node
        this.boker = RED.nodes.getNode(config.broker);
        node.on('close', async function() {
            const self = this;
            self.producer && await self.producer.close();
            self.client && await self.client.close();
        });
        try {
            node.client = new Pulsar.Client({
                serviceUrl: node.boker.serviceUrl,
            });
        } catch (e) {
            node.error('Error creating pulsar client: ' + e);
            node.status({fill: "red", shape: "dot", text: "Connection error"});
        }
        node.status({fill: "yellow", shape: "dot", text: "connecting"});
        node.client.createProducer({
            topic: node.topic,
            producerName: node.producerName
        }).then(producer => {
            node.debug('Producer created');
            node.producer = producer;
            node.status({fill: "green", shape: "dot", text: "connected"});
            const message = {
                topic: 'pulsar',
                payload: {
                    type: 'producer',
                    status: 'ready',
                    topic: node.topic,
                    producerName: node.producerName
                }
            };
            node.send(message);
        }).catch(e => {
            node.debug('Error creating producer: ' + e);
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