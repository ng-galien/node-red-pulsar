const Pulsar = require('pulsar-client');

module.exports = function (RED) {
    function PulsarProducer(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // Retrieve the config node
        this.boker = RED.nodes.getNode(config.broker);

        node.client = new Pulsar.Client({
            serviceUrl: node.boker.serviceUrl,
        });

        node.client.createProducer({
            topic: config.topic, producerName: config.producerName
        }).then(producer => {
            node.debug('Producer created');
            node.producer = producer;
            node.status({fill: "green", shape: "dot", text: "connected"});
        }).catch(e => {
            node.debug('Error creating producer: ' + e);
            node.status({fill: "red", shape: "dot", text: "Connection error"});
        });

        node.on('input', function (msg, send, done) {
            if (node.producer) {
                node.status({fill: "orange", shape: "dot", text: "message received"});
                node.debug('Message received');
                if (!msg.payload) {
                    node.warn('Payload is empty');
                    node.status({fill: "orange", shape: "dot", text: "Payload is empty"});
                    return;
                }
                const str = JSON.stringify(msg.payload);
                const buffer = Buffer.from(str);
                node.producer.send({
                    data: buffer
                }).then(r => {
                    node.status({fill: "green", shape: "dot", text: "connected"});
                }).catch(e => {
                    node.error('Error sending message: ' + e);
                    node.status({fill: "red", shape: "dot", text: "Send error"});
                });
            } else {
                node.error('Producer not created');
                node.status({fill: "red", shape: "dot", text: "Producer not created"});
            }
            if (done) {
                done();
            }
        });
        node.on('close', function () {
            if (node.client) {
                node.client.close().then(r => {
                    node.debug('Pulsar client closed');
                })
            }
        });
    }

    RED.nodes.registerType("pulsar-producer", PulsarProducer);
}