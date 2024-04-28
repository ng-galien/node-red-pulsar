import * as NodeRED from 'node-red'
import {PulsarSchemaConfig, SCHEMA_NODE_TYPE} from "../PulsarDef";
import {SchemaInfo} from "pulsar-client";

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(SCHEMA_NODE_TYPE,
        function (this: NodeRED.Node<SchemaInfo>, config: PulsarSchemaConfig): void {
            RED.nodes.createNode(this, config)
            this.credentials = config
        }
    )
}

