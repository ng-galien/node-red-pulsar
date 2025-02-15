import { Client, SchemaInfo } from 'pulsar-client';
import * as NodeRED from 'node-red';
import { PulsarConsumerConfig, PulsarProducerConfig } from './PulsarDefinition';

type RED = NodeRED.NodeAPI;

type ActorConfig = PulsarProducerConfig | PulsarConsumerConfig;

type ActorRequirement = Client | undefined;

export function requireClient(red: RED, config: ActorConfig): ActorRequirement {
    const clientNode = red.nodes.getNode(
        config.clientNodeId,
    ) as NodeRED.Node<Client>;
    if (!clientNode) {
        return undefined;
    }
    return clientNode.credentials;
}

export function requireSchema(
    red: RED,
    config: ActorConfig,
): SchemaInfo | undefined {
    const schemaNode = red.nodes.getNode(
        config.schemaNodeId,
    ) as NodeRED.Node<SchemaInfo>;
    if (schemaNode) {
        return schemaNode.credentials;
    }
    return undefined;
}
