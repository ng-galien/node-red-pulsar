import * as NodeRED from 'node-red'
import {parseMandatoryEnum, PulsarSchemaConfig, PulsarSchemaId} from "../PulsarDefinition";
import {SchemaInfo, SchemaType} from "pulsar-client";

function createSchemaConfig(config: PulsarSchemaConfig): SchemaInfo {
    return {
        name: config.name,
        schemaType: parseMandatoryEnum<SchemaType>(config.type),
        schema: config.schema,
        properties: undefined
    }

}

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarSchemaId,
        function (this: NodeRED.Node<SchemaInfo>, config: PulsarSchemaConfig): void {
            RED.nodes.createNode(this, config)
            this.credentials = createSchemaConfig(config)
        }
    )
}

