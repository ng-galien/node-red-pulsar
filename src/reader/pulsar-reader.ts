import * as NodeRED from "node-red";
import {Message, Reader, ReaderConfig} from "pulsar-client";
import {requireClient} from "../PulsarNode";
import {
    PulsarReaderConfig, PulsarReaderId, readPulsarMessage
} from "../PulsarDefinition";
import {readerConfig} from "../PulsarConfig";

type ReaderNode = NodeRED.Node<Reader>

function createConfig(config: PulsarReaderConfig, node: ReaderNode): ReaderConfig {
    const listener = (message: Message) => {
        node.debug('Received message: ' + JSON.stringify(message))
        const nodeMessage = readPulsarMessage(message)
        node.send([nodeMessage, null])
    }
    return {
        listener: listener,
        ... readerConfig(config)
    }
}

/**
 * Registers the 'pulsar-consumer' type with its configuration.
 */
export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarReaderId,
        function (this: ReaderNode, config: PulsarReaderConfig): void {
            RED.nodes.createNode(this, config);
            const client = requireClient(RED, config)
            if (!client) {
                this.error('Client not created')
                return
            }
            const readerConfig = createConfig(config, this)
            client.createReader(readerConfig).then(reader => {
                this.credentials = reader
                this.log('Reader created: ' + JSON.stringify(reader))
                this.status({fill: "green", shape: "dot", text: "connected"})
                const message = {
                    topic: 'pulsar',
                    payload: {
                        type: 'reader',
                        status: 'ready',
                        topic: config.topic
                    }
                };
                this.send([null, message]);
            }).catch(e => {
                this.error('Error creating reader: ' + e)
                this.status({fill: "red", shape: "dot", text: "Connection error"})
            })
        }
    )
}
