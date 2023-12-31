const Pulsar = require('pulsar-client');
const uuid = require('uuid');

module.exports = function(RED) {
    function PulsarConsumer(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.status({fill: "red", shape: "dot", text: "disconnected"});
        node.topic = config.topic;
        node.subscription = config.subscription || 'consumer-'+uuid.v4();
        node.subscriptionType = config.subscriptionType || 'Shared';
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
        node.status({fill: "yellow", shape: "dot", text: "connecting"});
        if (node.client) {
            node.client.subscribe({
                topic: node.topic,
                subscriptionType: node.subscriptionType,
                subscription: node.subscription,
                ackTimeoutMs: 10000,
                listener: (pulsarMessage, msgConsumer) => {
                    node.debug('Message received');
                    //if the buffer is empty, the message is not a json object
                    const str = pulsarMessage.getData().toString();
                    try {
                        const data = JSON.parse(str);
                        const msg = {
                            topic: node.topic,
                            payload: data
                        };
                        node.send([msg, null]);
                    } catch (e) {
                        node.debug('Message is not a json object');
                        const msg = {
                            topic: node.topic,
                            payload: str
                        };
                        node.send([msg, null]);
                    }
                    msgConsumer.acknowledge(pulsarMessage).then(r => {
                        node.debug('Message acknowledged'+r);
                    }).catch(e => {
                        node.error('Error acknowledging message: ' + e);
                        node.status({fill: "red", shape: "dot", text: "Ack error"});
                    });
                }
            }).then(consumer => {
                node.consumer = consumer;
                node.debug('Consumer created');
                node.status({fill: "green", shape: "dot", text: "connected"});
                const message = {
                    topic: 'pulsar',
                    payload: {
                        type: 'consumer',
                        status: 'ready',
                        topic: node.topic,
                        subscription: node.subscription,
                        subscriptionType: node.subscriptionType
                    }
                };
                node.send([null, message]);

            }).catch(e => {
                node.error('Error creating consumer: ' + e);
                node.status({fill: "red", shape: "dot", text: "Connection error"});
            });
        }
    }
    RED.nodes.registerType("pulsar-consumer",PulsarConsumer);
}