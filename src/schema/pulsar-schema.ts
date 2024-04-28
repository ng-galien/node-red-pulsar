import * as NodeRED from 'node-red'
import {parseMandatoryEnum, PulsarSchemaConfig, PulsarSchemaId} from "../PulsarDefinition";
import {SchemaInfo, SchemaType} from "pulsar-client";


/**
 * Creates a schema information object from the provided configuration.
 *
 * @param {PulsarSchemaConfig} config - The configuration object containing the schema information.
 * @property {string} config.name - The name of the schema.
 * @property {string} config.type - The type of the schema.
 * @property {*} config.schema - The schema object.
 *
 * @return {SchemaInfo} - The created schema configuration object.
 * @property {string} SchemaInfo.name - The name of the schema.
 * @property {SchemaType} SchemaInfo.schemaType - The type of the schema.
 * @property {*} SchemaInfo.schema - The schema object.
 * @property {undefined} SchemaInfo.properties - The properties of the schema (currently undefined).
 */
function createSchemaInfo(config: PulsarSchemaConfig): SchemaInfo {
    return {
        name: config.name,
        schemaType: parseMandatoryEnum<SchemaType>(config.type),
        schema: config.schema,
        properties: undefined
    }
}

/**
 * Registers the Pulsar Schema node with the provided RED instance.
 *
 * @param {NodeRED.NodeAPI} RED - The RED instance to register the node with.
 * @return {void} - No return value.
 */
export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarSchemaId,
        function (this: NodeRED.Node<SchemaInfo>, config: PulsarSchemaConfig): void {
            RED.nodes.createNode(this, config)
            this.credentials = createSchemaInfo(config)
        }
    )
}

