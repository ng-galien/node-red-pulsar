import * as NodeRED from "node-red";
import {Message, Reader, ReaderConfig} from "pulsar-client";
import {requireClient} from "../PulsarNode";
import {
    PulsarReaderConfig, PulsarReaderId, readPulsarMessage, StartMessage
} from "../PulsarDefinition";
import {parseChoice, readerConfig, readerPosition} from "../PulsarConfig";

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
            this.on('input', (msg) => {
                if (msg.topic === 'seek') {
                    if(isRightSeekPayloadPosition(msg.payload)) {
                        seekPosition(this, msg.payload as StartMessage)
                    } else if (isRightSeekPayloadTimestamp(msg.payload)) {
                        seekTimestamp(this, msg.payload as number)
                    } else {
                        this.error('Invalid seek payload: ' + msg.payload + ' type: ' + typeof msg.payload)
                    }
                } else {
                    this.error('Invalid input: ' + JSON.stringify(msg))
                }
            })
        }
    )
}

function isRightSeekPayloadPosition(payload: any): boolean {
    return typeof payload === 'string' && parseChoice<StartMessage>(['Earliest', 'Latest'], payload) !== undefined
}

function isRightSeekPayloadTimestamp(payload: any): boolean {
    return typeof payload === 'number' && payload >= 0
}

function seekPosition(node: ReaderNode, value: StartMessage) {
    const reader = node.credentials as Reader
    reader.seek(readerPosition(value)).then(() => {
        node.log('Seeked to: ' + value)
    }).catch(e => {
        node.error('Error seeking: ' + e)
    })
}

function seekTimestamp(node: ReaderNode, value: number) {
    const reader = node.credentials as Reader
    reader.seekTimestamp(value).then(() => {
        node.log('Seeked to timestamp: ' + value)
    }).catch(e => {
        node.error('Error seeking: ' + e)
    })
}
