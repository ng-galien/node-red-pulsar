import {PulsarSchemaEditorConfig, SCHEMA_NODE_TYPE } from '../PulsarDef';

type EditorRED = import('node-red').EditorRED
declare const RED: EditorRED

RED.nodes.registerType<PulsarSchemaEditorConfig>(SCHEMA_NODE_TYPE, {
    category: 'config',
    color: '#188fff',
    icon: "font-awesome/fa-puzzle-piece",
    defaults: {
        schemaName: {value: '', required: false, validate: RED.validators.regex(/^[a-zA-Z0-9_]+$/)},
        schemaType: {value: 'None', required: true},
        schema: {value: "", required: false },
        properties: {value: "", required: false }
    },
    label: function() {
        return this.name || "pulsar-schema";
    },
    oneditprepare: function() {
        $("#node-config-input-schemaType").typedInput({
            types: [
                {
                    value: "None",
                    options: schemaTypeOptions()
                }
            ]
        })
        $("#node-config-input-schema").typedInput({
            default: 'json',
            types: ['json'],
            typeField: '#node-config-input-schema-type'
        });
        $("#node-config-input-properties").typedInput({
            default: 'json',
            types: ['json'],
            typeField: '#node-config-input-properties-type'
        });
    }
});

function schemaTypeOptions() {
    return [
        { value: "None", label: "None"},
        { value: "String", label: "String"},
        { value: "Json", label: "Json"},
        { value: "Protobuf", label: "Protobuf"},
        { value: "Avro", label: "Avro"},
        { value: "Boolean", label: "Boolean"},
        { value: "Int8", label: "Int8"},
        { value: "Int16", label: "Int16"},
        { value: "Int32", label: "Int32"},
        { value: "Int64", label: "Int64"},
        { value: "Float32", label: "Float32"},
        { value: "Float64", label: "Float64"},
        { value: "KeyValue", label: "KeyValue"},
        { value: "Bytes", label: "Bytes"},
        { value: "AutoConsume", label: "AutoConsume"},
        { value: "AutoPublish", label: "AutoPublish"}
    ]
}
