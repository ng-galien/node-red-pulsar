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
        startMessage: {value: 'Latest', required: true },
        receiverQueueSize: {value: '100', required: false, validate: RED.validators.number()},
        readerName: {value: '', required: false},
        readCompacted: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        subscriptionRolePrefix: {value: '', required: false},
        privateKeyPath: {value: '', required: false},
        cryptoFailureAction: {value: 'FAIL', required: false},
    },
    // label: function (this: EditorNode) {
    //     return this.name || this.topic || 'pulsar-reader'
    // },
    oneditprepare: function () {
        configureTypedFields(false, [
            {name: 'receiverQueueSize', type: 'num'},
            {name: 'readCompacted', type: 'bool'},
        ])
        type StartMessage = import("../PulsarDefinition").StartMessage
        configureOptionalEnumField<StartMessage>(false, true, 'subscriptionType', ['Earliest', 'Latest'])
        type CryptoFailureAction = import("pulsar-client").ConsumerCryptoFailureAction
        configureOptionalEnumField<CryptoFailureAction>(false, true, 'cryptoFailureAction', ['FAIL', 'DISCARD'])
    }
})
