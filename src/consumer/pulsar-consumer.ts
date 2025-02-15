import * as NodeRED from 'node-red'
import {
    PulsarConsumerConfig,
    PulsarConsumerId, readPulsarMessage
} from "../PulsarDefinition";
import {
    Consumer,
    ConsumerConfig,
    Message
} from "pulsar-client";
import {requireClient, requireSchema} from "../PulsarNode";
import {
    consumerConfig
} from "../PulsarConfig";

type ConsumerNode = NodeRED.Node<Consumer>

/**
 * Sets up a listener for consuming messages from Pulsar
 *
 * @param {PulsarConsumerConfig} config - The configuration for the Pulsar consumer
 * @param {ConsumerNode} node - The consumer node to handle the received messages
 *
 * @return {ConsumerConfig} - The configuration for the consumer, including the listener
 */
function setupListener(config: PulsarConsumerConfig, node: ConsumerNode): ConsumerConfig {
    const listener = function (pulsarMessage: Message, consumer: Consumer): void {
        node.log('Message received' + pulsarMessage)
        //if the buffer is empty, the message is not a json object
        const nodeMessage = readPulsarMessage(pulsarMessage)
        node.send([nodeMessage, null])
        consumer.acknowledge(pulsarMessage).then(r => {
            node.debug('Message acknowledged' + r)
        }).catch(e => {
            node.error('Error acknowledging message: ' + e)
            node.status({fill: "red", shape: "dot", text: "Ack error"})
        })
    }
    return {
        listener: listener,
        ...consumerConfig(node, config)
    }
}

/**
 * Registers the 'pulsar-consumer' type with its configuration.
 */
export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarConsumerId,
        function (this: ConsumerNode, config: PulsarConsumerConfig): void {
            RED.nodes.createNode(this, config)
            const requirement = requireClient(RED, config)
            if (!requirement) {
                this.error('Config node not found')
                return
            }
            const consumerConfig = setupListener(config, this)
            consumerConfig.schema = requireSchema(RED, config)
            try {
                this.debug('Creating consumer: ' + JSON.stringify(consumerConfig))
                requirement.subscribe(consumerConfig).then(consumer => {
                    this.credentials = consumer
                    this.log('Consumer created')
                    this.status({fill: "green", shape: "dot", text: "connected"})
                    const message = {
                        topic: 'pulsar',
                        payload: {
                            type: 'consumer',
                            status: 'ready',
                            topic: config.topic,
                            subscription: config.subscription,
                            subscriptionType: config.subscriptionType
                        }
                    };
                    this.send([null, message]);
                }).catch(e => {
                    this.error('Error creating consumer: ' + e)
                    this.status({fill: "red", shape: "dot", text: "Connection error"})
                })
            } catch (e) {
                this.error('Error creating consumer: ' + e)
                this.status({fill: "red", shape: "dot", text: "Connection error"})
            }
        }
    )
}
