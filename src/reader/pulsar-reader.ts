import * as NodeRED from "node-red";
import {ConsumerCryptoFailureAction, Message, MessageId, Reader, ReaderConfig} from "pulsar-client";
import {requireClient} from "../PulsarNode";
import {
    parseBoolean,
    parseEnum,
    parseNumber,
    parseString,
    PulsarReaderConfig, readPulsarMessage
} from "../PulsarDefinition";

type ReaderNode = NodeRED.Node<Reader>

function createConfig(config: PulsarReaderConfig, node: ReaderNode): ReaderConfig {
    const listener = (message: Message, _reader: Reader) => {
        node.debug('Received message: ' + JSON.stringify(message))
        const nodeMessage = readPulsarMessage(message)
        node.send([nodeMessage, null])
    }
    const startMessage = config.startMessage == "Earliest" ? MessageId.earliest : MessageId.latest
    return {
        topic: config.topic,
        startMessageId: startMessage(),
        receiverQueueSize: parseNumber(config.receiverQueueSize),
        readerName: parseString(config.readerName),
        subscriptionRolePrefix: parseString(config.subscriptionRolePrefix),
        readCompacted: parseBoolean(config.readCompacted),
        listener: listener,
        privateKeyPath: parseString(config.privateKeyPath),
        cryptoFailureAction: parseEnum<ConsumerCryptoFailureAction>(config.cryptoFailureAction)
    }
}

/**
 * Registers the 'pulsar-consumer' type with its configuration.
 */
export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType('pulsar-reader',
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
            }).catch(e => {
                this.error('Error creating reader: ' + e)
                this.status({fill: "red", shape: "dot", text: "Connection error"
            })
        }
    )
}
