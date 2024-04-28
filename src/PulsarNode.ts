import {Client, Consumer, Producer, SchemaInfo} from "pulsar-client";
import * as NodeRED from "node-red";
import {PulsarConsumerConfig, PulsarProducerConfig} from "./PulsarDefinition";

type PulsarActor = Producer | Consumer
type PulsarNode = NodeRED.Node<PulsarActor>

export function closeActor(_node: PulsarNode, callback: () => void) {
    callback();
    // const actor = node.credentials
    // if(actor && actor.isConnected()) {
    //     actor.close().then(() => {
    //         node.status({fill: "red", shape: "dot", text: "disconnected"})
    //         callback()
    //     }).catch(e => {
    //         node.error('Error closing actor: ' + e)
    //         node.status({fill: "red", shape: "dot", text: "Error closing"})
    //         callback()
    //     })
    // } else {
    //     callback()
    // }
}

type RED = NodeRED.NodeAPI

type ActorConfig = PulsarProducerConfig | PulsarConsumerConfig

type ActorRequirement = Client | undefined

export function requireClient(red: RED, config: ActorConfig): ActorRequirement {
    const clientNode = red.nodes.getNode(config.clientNodeId) as NodeRED.Node<Client>
    if(!clientNode) {
        return undefined
    }
    return clientNode.credentials

}

export function requireSchema(red: RED, config: ActorConfig): SchemaInfo | undefined {
    const schemaNode= red.nodes.getNode(config.schemaNodeId) as NodeRED.Node<SchemaInfo>
    if(schemaNode) {
        return schemaNode.credentials
    }
    return undefined
}
