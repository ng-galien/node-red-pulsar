type PulsarReaderEditorConfig = import("../PulsarDefinition").PulsarReaderEditorConfig

RED.nodes.registerType<PulsarReaderEditorConfig>(READER_ID, {
    category: PULSAR_CATEGORY,
    icon: 'font-awesome/fa-eye',
    color: PULSAR_COLOR,
    inputs: 1,
    outputs: 2,
    defaults: {
        name: {value: ''},
        clientNodeId: {value: '', required:true, type: CLIENT_ID },
        schemaNodeId: {value: '', required: false, type: SCHEMA_ID },
        topic: {value: '', required: true },
        topicTypedInput: {value: 'str', required: true},
        startMessage: {value: 'Latest', required: true },
        receiverQueueSize: {value: '100', required: false, validate: RED.validators.number()},
        readerName: {value: '', required: false},
        readCompacted: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        subscriptionRolePrefix: {value: '', required: false},
        privateKeyPath: {value: '', required: false},
        cryptoFailureAction: {value: 'FAIL', required: false},
    },
    label: function () {
        return this.name || this.topic || "Reader"
    },
    outputLabels: function(i) {
        return i === 0 ? "Message" : "Status"
    },
    inputLabels: function() {
        return "Control"
    },
    oneditprepare: function () {
        configureTypedFields(false, [
            {name: 'topic', type: ['str', "env", "flow", "global"], value: this.topicTypedInput, defaultType: this.topicTypedInput as EditorWidgetTypedInputType},
            {name: 'receiverQueueSize', type: 'num', value: this.receiverQueueSize},
            {name: 'readCompacted', type: 'bool', value: this.readCompacted},
        ])
        type StartMessage = import("../PulsarDefinition").StartMessage
        configureOptionalEnumField<StartMessage>(false, true, 'startMessage', ['Earliest', 'Latest'])
        type CryptoFailureAction = import("pulsar-client").ConsumerCryptoFailureAction
        configureOptionalEnumField<CryptoFailureAction>(false, true, 'cryptoFailureAction', ['FAIL', 'DISCARD'])
    },
    oneditsave: function() {
        this.topicTypedInput = getPropertyType(false, 'topic')
    }
})
