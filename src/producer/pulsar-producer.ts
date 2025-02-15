import * as NodeRED from 'node-red';
import { PulsarProducerConfig, PulsarProducerId } from '../PulsarDefinition';
import { Producer, ProducerConfig, ProducerMessage } from 'pulsar-client';
import { requireClient, requireSchema } from '../PulsarNode';
import { producerConfig } from '../PulsarConfig';
import {
    anyToBoolean,
    anyToNumber,
    anyToProperties,
    anyToString,
    anyToStringArray,
} from '../Properties';
import { Node } from 'node-red';

type ProducerNode = NodeRED.Node<Producer>;

function setupProducer(
    RED: NodeRED.NodeAPI,
    rt: Node,
    config: PulsarProducerConfig,
): ProducerConfig {
    return {
        schema: requireSchema(RED, config),
        ...producerConfig(rt, config),
    };
}

function nodeMessageToPulsarMessage(msg: NodeRED.NodeMessage): ProducerMessage {
    const str = JSON.stringify(msg.payload);
    const buffer = Buffer.from(str);
    const anyMsg = msg as any;
    return {
        data: buffer,
        properties: anyToProperties(anyMsg),
        eventTimestamp: anyToNumber(anyMsg.eventTimestamp),
        sequenceId: anyToNumber(anyMsg.sequenceId),
        partitionKey: anyToString(anyMsg.partitionKey),
        orderingKey: anyToString(anyMsg.orderingKey),
        replicationClusters: anyToStringArray(anyMsg.replicationClusters),
        deliverAfter: anyToNumber(anyMsg.deliverAfter),
        deliverAt: anyToNumber(anyMsg.deliverAt),
        disableReplication: anyToBoolean(anyMsg.disableReplication),
    };
}

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(
        PulsarProducerId,
        function (this: ProducerNode, config: PulsarProducerConfig) {
            RED.nodes.createNode(this, config);
            const client = requireClient(RED, config);
            if (!client) {
                this.error('Client not created');
                return;
            }
            const producerConfig = setupProducer(RED, this, config);
            try {
                this.debug(
                    'Creating producer: ' + JSON.stringify(producerConfig),
                );
                client
                    .createProducer(producerConfig)
                    .then((producer) => {
                        this.debug('Producer created');
                        this.credentials = producer;
                        this.status({
                            fill: 'green',
                            shape: 'dot',
                            text: 'connected',
                        });
                        const message = {
                            topic: 'pulsar',
                            payload: {
                                type: 'producer',
                                status: 'ready',
                                topic: producerConfig.topic,
                                producerName: producerConfig.producerName,
                            },
                        };
                        this.send(message);
                    })
                    .catch((e) => {
                        this.error('Error creating producer: ' + e);
                        this.status({
                            fill: 'red',
                            shape: 'dot',
                            text: 'Connection error',
                        });
                    });
            } catch (e) {
                this.error('Error creating producer: ' + e);
                this.status({
                    fill: 'red',
                    shape: 'dot',
                    text: 'Connection error',
                });
            }

            this.on('input', (msg) => {
                const node = this as ProducerNode;
                node.log('Message received' + JSON.stringify(msg));
                const pulsarProducer = node.credentials;
                if (pulsarProducer) {
                    node.status({
                        fill: 'blue',
                        shape: 'dot',
                        text: 'message received',
                    });
                    if (!msg.payload) {
                        node.warn('Payload is empty');
                        node.status({
                            fill: 'yellow',
                            shape: 'dot',
                            text: 'Payload is empty',
                        });
                        return;
                    }
                    const str = JSON.stringify(msg.payload);
                    const buffer = Buffer.from(str);
                    try {
                        this.debug('Sending message: ' + buffer);
                        const pulsarMessage = nodeMessageToPulsarMessage(msg);
                        pulsarProducer
                            .send(pulsarMessage)
                            .then(() => {
                                node.status({
                                    fill: 'green',
                                    shape: 'dot',
                                    text: 'connected',
                                });
                            })
                            .catch((e) => {
                                node.error('Error sending message: ' + e);
                                node.status({
                                    fill: 'red',
                                    shape: 'dot',
                                    text: 'Send error',
                                });
                            });
                    } catch (e) {
                        node.error('Error sending message: ' + e);
                        node.status({
                            fill: 'red',
                            shape: 'dot',
                            text: 'Send error',
                        });
                    }
                } else {
                    node.error('Producer not created');
                    node.status({
                        fill: 'red',
                        shape: 'dot',
                        text: 'Producer not created',
                    });
                }
            });
        },
    );
};
