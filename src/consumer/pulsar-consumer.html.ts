type PulsarConsumerEditorConfig = import("../PulsarDefinition").PulsarConsumerEditorConfig


RED.nodes.registerType<PulsarConsumerEditorConfig>(CONSUMER_ID, {
    category: PULSAR_CATEGORY,
    icon: 'font-awesome/fa-inbox',
    color: PULSAR_COLOR,
    defaults: {
        name: {value: ''},
        clientNodeId: {value: '', type: CLIENT_ID, required: true},
        schemaNodeId: {value: '', type: SCHEMA_ID, required: false},
        topic: {value: '', required: true},
        topicsPattern: {value: '', required: false},
        subscription: {value: '', required: true},
        subscriptionType: {value: 'Shared', required: true},
        subscriptionInitialPosition: {value: 'Latest', required: true},
        ackTimeoutMs: {value: 10000, required: false, validate: RED.validators.number()},
        nAckRedeliverTimeoutMs: {value: 60000, required: false, validate: RED.validators.number()},
        receiverQueueSize: {value: 100, required: false, validate: RED.validators.number()},
        receiverQueueSizeAcrossPartitions: {value: 1000, required: false, validate: RED.validators.number()},
        consumerName: {value: '', required: false},
        readCompacted: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        privateKeyPath: {value: '', required: false},
        cryptoFailureAction: {value: 'FAIL', required: false},
        maxPendingChunkedMessage: {value: 10, required: false, validate: RED.validators.number()},
        autoAckOldestChunkedMessageOnQueueFull: {value: 10, required: false, validate: RED.validators.number()},
        batchIndexAckEnabled: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        regexSubscriptionMode: {value: 'AllTopics', required: false},
        deadLetterPolicy: {value: undefined, required: false},
    },
    label: function () {
        return this.name || 'pulsar-client'
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
    }
})
