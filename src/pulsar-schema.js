const propUtils = require('./properties-util');


function propertiesToSchemaInfo(properties, RED) {
    const result = {};
    if (!properties.schemaType) {
        throw new Error('Schema type is required');
    }
    result.schemaType = RED.util.evaluateNodeProperty(properties.schemaType, "str", this);
    if (propUtils.isNonEmptyString(properties.name)) {
        result.name = RED.util.evaluateNodeProperty(properties.name, "str", this);
    }
    if (propUtils.isNonEmptyString(properties.schema)) {
        result.schema = RED.util.evaluateNodeProperty(properties.schema, "json", this);
    }
    if (propUtils.isNonEmptyString(properties.properties)) {
        result.schema = RED.util.evaluateNodeProperty(properties.properties, "json", this);
    }
    return result;
}

module.exports = function (RED) {
    function PulsarSchemaNode(properties) {
        RED.nodes.createNode(this, properties);
        const node = this;
        if (!properties.schemaType) {
            return;
        }
        node.schemaInfo = propertiesToSchemaInfo(properties, RED);
    }

    RED.nodes.registerType("pulsar-schema", PulsarSchemaNode);
};
