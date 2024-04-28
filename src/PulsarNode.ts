import {Client, Consumer, Producer, SchemaInfo} from "pulsar-client";
import * as NodeRED from "node-red";
import {PulsarConsumerConfig, PulsarProducerConfig} from "./PulsarDefinition";

type PulsarActor = Producer | Consumer
type PulsarNode = NodeRED.Node<PulsarActor>

export function closeActor(node: PulsarNode, callback: () => void) {
    const actor = node.credentials
    if(actor) {
        actor.close().then(() => {
            node.status({fill: "red", shape: "dot", text: "disconnected"})
            callback()
        }).catch(e => {
            node.error('Error closing actor: ' + e)
            node.status({fill: "red", shape: "dot", text: "Error closing"})
            callback()
        })
    } else {
        callback()
    }
}

type RED = NodeRED.NodeAPI

type ActorConfig = PulsarProducerConfig | PulsarConsumerConfig

type ActorRequirement = Client | undefined

export function getActorActorRequirement(red: RED, node: PulsarNode, config: ActorConfig): ActorRequirement {
    const clientNode = red.nodes.getNode(config.clientNodeId) as NodeRED.Node<Client>
    if(!clientNode) {
        node.error('Client node not found')
        node.status({fill: "red", shape: "dot", text: "Client node not found"})
        return undefined
    }
    const pulsarClient = clientNode.credentials
    const schemaNode = red.nodes.getNode(config.schemaNodeId) as NodeRED.Node<SchemaInfo>
    if(schemaNode) {
        config.schema = schemaNode.credentials
    }
    return pulsarClient
}
