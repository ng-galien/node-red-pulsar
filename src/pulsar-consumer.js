const Pulsar = require('pulsar-client');

module.exports = function(RED) {
    function PulsarConsumer(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        // Retrieve the config node
        this.boker = RED.nodes.getNode(config.broker);
        node.on('close', async function() {
            node.consumer && await node.consumer.close();
            node.client && await node.client.close();
        });
        try {
            node.client = new Pulsar.Client({
                serviceUrl: node.boker.serviceUrl,
                operationTimeoutSeconds: 30
            });
        } catch (e) {
            node.error('Error creating pulsar client: ' + e);
            node.status({fill: "red", shape: "dot", text: "Connection error"});
        }
        if (node.client) {
            node.client.subscribe({
                topic: config.topic,
                subscriptionType: 'Shared',
                subscription: config.subscription,
                ackTimeoutMs: 10000,
                listener: (message, msgConsumer) => {
                    node.debug('Message received');
                    node.status({fill: "orange", shape: "dot", text: "message received"});
                    //if the buffer is empty, the message is not a json object
                    const str = message.getData().toString();
                    try {
                        const data = JSON.parse(str);
                        node.send({payload: data});
                    } catch (e) {
                        node.debug('Message is not a json object');
                        node.send({payload: str});
                    }
                    msgConsumer.acknowledge(message).then(r => {
                        node.debug('Message acknowledged'+r);
                        node.status({fill: "green", shape: "dot", text: "connected"});
                    }).catch(e => {
                        node.error('Error acknowledging message: ' + e);
                        node.status({fill: "red", shape: "dot", text: "Ack error"});
                    });
                }
            }).then(consumer => {
                node.consumer = consumer;
                node.debug('Consumer created');
                node.status({fill: "green", shape: "dot", text: "connected"});

            }).catch(e => {
                node.error('Error creating consumer: ' + e);
                node.status({fill: "red", shape: "dot", text: "Connection error"});
            });
        }
    }
    RED.nodes.registerType("pulsar-consumer",PulsarConsumer);
}