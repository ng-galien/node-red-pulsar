type PulsarProducerEditorConfig =
  import('../PulsarDefinition').PulsarProducerEditorConfig;

RED.nodes.registerType<PulsarProducerEditorConfig>(PRODUCER_ID, {
  category: PULSAR_CATEGORY,
  icon: 'font-awesome/fa-paper-plane',
  color: PULSAR_COLOR,
  inputs: 1,
  outputs: 1,
  inputLabels: 'payload',
  outputLabels: 'status',
  defaults: {
    name: { value: '' },
    clientNodeId: { value: '', type: CLIENT_ID, required: true },
    schemaNodeId: { value: '', type: SCHEMA_ID, required: false },
    topic: { value: '', required: true },
    topicTypedInput: { value: 'str' },
    producerName: { value: '', required: false },
    sendTimeoutMs: { value: undefined, required: false },
    initialSequenceId: { value: undefined, required: false },
    maxPendingMessages: { value: undefined, required: false },
    maxPendingMessagesAcrossPartitions: {
      value: undefined,
      required: false,
    },
    blockIfQueueFull: { value: undefined, required: false },
    messageRoutingMode: { value: undefined, required: false },
    hashingScheme: { value: undefined, required: false },
    compressionType: { value: undefined, required: false },
    batchingEnabled: { value: undefined, required: false },
    batchingMaxPublishDelayMs: { value: undefined, required: false },
    batchingMaxMessages: { value: undefined, required: false },
    properties: { value: undefined, required: false },
    publicKeyPath: { value: '', required: false },
    encryptionKey: { value: '', required: false },
    cryptoFailureAction: { value: undefined, required: false },
    chunkingEnabled: { value: undefined, required: false },
    accessMode: { value: undefined, required: false },
  },
  label: function () {
    return this.name || this.topic?.length > 0
      ? this.topicTypedInput + ':' + this.topic
      : 'pulsar-producer';
  },
  oneditprepare: function () {
    const fields: TypedField[] = [
      {
        name: 'topic',
        type: ['str', 'env', 'flow', 'global'],
        value: this.topic,
        defaultType: this.topicTypedInput as EditorWidgetTypedInputType,
      },
      { name: 'sendTimeoutMs', type: 'num', value: this.sendTimeoutMs },
      {
        name: 'initialSequenceId',
        type: 'num',
        value: this.initialSequenceId,
      },
      {
        name: 'maxPendingMessages',
        type: 'num',
        value: this.maxPendingMessages,
      },
      {
        name: 'maxPendingMessagesAcrossPartitions',
        type: 'num',
        value: this.maxPendingMessagesAcrossPartitions,
      },
      {
        name: 'blockIfQueueFull',
        type: 'bool',
        value: this.blockIfQueueFull,
      },
      {
        name: 'batchingMaxPublishDelayMs',
        type: 'num',
        value: this.batchingMaxPublishDelayMs,
      },
      {
        name: 'batchingMaxMessages',
        type: 'num',
        value: this.batchingMaxMessages,
      },
      { name: 'properties', type: 'json', value: this.properties },
    ];
    configureTypedFields(false, fields);
    type MessageRoutingMode = import('pulsar-client').MessageRoutingMode;
    configureEnumField<MessageRoutingMode>(false, 'messageRoutingMode', [
      'CustomPartition',
      'RoundRobinDistribution',
      'UseSinglePartition',
    ]);
    type HashingScheme = import('pulsar-client').HashingScheme;
    configureEnumField<HashingScheme>(false, 'hashingScheme', [
      'Murmur3_32Hash',
      'BoostHash',
      'JavaStringHash',
    ]);
    type CompressionType = import('pulsar-client').CompressionType;
    configureEnumField<CompressionType>(false, 'compressionType', [
      'Zlib',
      'LZ4',
      'ZSTD',
      'SNAPPY',
    ]);
    type CryptoFailureAction =
      import('pulsar-client').ProducerCryptoFailureAction;
    configureEnumField<CryptoFailureAction>(false, 'cryptoFailureAction', [
      'FAIL',
      'SEND',
    ]);
    type AccessMode = import('pulsar-client').ProducerAccessMode;
    configureEnumField<AccessMode>(false, 'accessMode', [
      'Shared',
      'Exclusive',
      'WaitForExclusive',
      'ExclusiveWithFencing',
    ]);
    configureJsonStringField(false, 'properties');
  },
  oneditsave: function () {
    this.topicTypedInput = getPropertyType(false, 'topic');
  },
});
