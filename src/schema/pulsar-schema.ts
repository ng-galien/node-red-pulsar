import * as NodeRED from 'node-red'
import {PulsarSchemaConfig, PulsarSchemaId} from "../PulsarDefinition";
import {SchemaInfo} from "pulsar-client";

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarSchemaId,
        function (this: NodeRED.Node<SchemaInfo>, config: PulsarSchemaConfig): void {
            RED.nodes.createNode(this, config)
            this.credentials = config
        }
    )
}

