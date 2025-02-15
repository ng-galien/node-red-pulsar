type PulsarSchemaEditorConfig =
  import('../PulsarDefinition').PulsarSchemaEditorConfig;
type PulsarSchemaType = import('pulsar-client').SchemaType;

const schemas: PulsarSchemaType[] = [
  'None',
  'String',
  'Json',
  'Protobuf',
  'Avro',
  'Boolean',
  'Int8',
  'Int16',
  'Int32',
  'Int64',
  'Float32',
  'Float64',
  'KeyValue',
  'Bytes',
  'AutoConsume',
  'AutoPublish',
];

RED.nodes.registerType<PulsarSchemaEditorConfig>(SCHEMA_ID, {
  category: PULSAR_CONFIG,
  color: PULSAR_COLOR,
  icon: 'font-awesome/fa-id-card',
  defaults: {
    schemaName: {
      value: '',
      required: false,
      validate: RED.validators.regex(/^[a-zA-Z0-9_-]+$/),
    },
    schemaType: { value: 'None', required: true },
    schema: { value: '', required: false },
    properties: { value: '', required: false },
  },
  label: function () {
    return this.schemaName || 'pulsar-schema';
  },
  oneditprepare: function () {
    const fields: TypedField[] = [
      { name: 'schema', type: 'json' },
      { name: 'properties', type: 'json' },
    ];
    configureTypedFields(true, fields);
    configureEnumField<PulsarSchemaType>(true, 'schemaType', schemas);
    configureJsonStringField(true, 'schema');
    configureJsonStringField(true, 'properties');
  },
});
