type PulsarConsumerEditorConfig = import("../PulsarDefinition").PulsarConsumerEditorConfig

type EditorNode = import('node-red').EditorNodeInstance<PulsarConsumerEditorConfig>

RED.nodes.registerType<PulsarConsumerEditorConfig>(CONSUMER_ID, {
    category: PULSAR_CATEGORY,
    icon: 'font-awesome/fa-envelope',
    color: PULSAR_COLOR,
    inputs: 1,
    outputs: 2,
    defaults: {
        name: {value: ''},
        clientNodeId: {value: '', required:true, type: CLIENT_ID },
        schemaNodeId: {value: '', required: false, type: SCHEMA_ID },
        topic: {value: '', required: false },
        subscription: {value: '', required: true, validate: RED.validators.regex(/^[a-zA-Z0-9_-]+$/)},
        subscriptionType: {value: 'Shared', required: true},
        subscriptionInitialPosition: {value: 'Latest', required: true},
        ackTimeoutMs: {value: '10000', required: false, validate: RED.validators.number()},
        nAckRedeliverTimeoutMs: {value: '60000', required: false, validate: RED.validators.number()},
        receiverQueueSize: {value: '100', required: false, validate: RED.validators.number()},
        receiverQueueSizeAcrossPartitions: {value: '1000', required: false, validate: RED.validators.number()},
        consumerName: {value: '', required: false},
        readCompacted: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        privateKeyPath: {value: '', required: false},
        cryptoFailureAction: {value: 'FAIL', required: false},
        maxPendingChunkedMessage: {value: '10', required: false, validate: RED.validators.number()},
        autoAckOldestChunkedMessageOnQueueFull: {value: '10', required: false, validate: RED.validators.number()},
        batchIndexAckEnabled: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        regexSubscriptionMode: {value: 'AllTopics', required: false},
        deadLetterPolicy: {value: undefined, required: false},
    },
    label: function (this: EditorNode) {
        return this.name || this.topic || 'pulsar-consumer'
    },
    oneditprepare: function () {
        const fields: TypedField[] = [
            {name: 'ackTimeoutMs', type: 'num'},
            {name: 'nAckRedeliverTimeoutMs', type: 'num'},
            {name: 'receiverQueueSize', type: 'num'},
            {name: 'receiverQueueSizeAcrossPartitions', type: 'num'},
            {name: 'readCompacted', type: 'bool'},
            {name: 'maxPendingChunkedMessage', type: 'num'},
            {name: 'autoAckOldestChunkedMessageOnQueueFull', type: 'num'},
            {name: 'batchIndexAckEnabled', type: 'bool'},
        ]
        configureTypedFields(false, fields)
        type SubscriptionType = import("pulsar-client").SubscriptionType
        configureEnumField<SubscriptionType>(false, 'subscriptionType', ['Shared', 'Exclusive', 'Failover', 'KeyShared'])
        type SubscriptionInitialPosition = import("pulsar-client").InitialPosition
        configureEnumField<SubscriptionInitialPosition>(false, 'subscriptionInitialPosition', ['Latest', 'Earliest'])
        type RegexSubscriptionMode = import("pulsar-client").RegexSubscriptionMode
        configureEnumField<RegexSubscriptionMode>(false, 'regexSubscriptionMode', ['AllTopics', 'PersistentOnly', 'NonPersistentOnly'])
        type CryptoFailureAction = import("pulsar-client").ConsumerCryptoFailureAction
        configureEnumField<CryptoFailureAction>(false, 'cryptoFailureAction', ['FAIL', 'DISCARD'])
    },

    oneditsave: function (this: EditorNode) {
        const consumerConfig = this as PulsarConsumerEditorConfig
        console.log('saving consumer config', consumerConfig.clientNodeId)
    }
})
