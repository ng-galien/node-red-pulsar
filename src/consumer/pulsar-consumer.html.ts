import {
    CLIENT_NODE_TYPE,
    CONSUMER_NODE_TYPE,
    PULSAR_NODE_CATEGORY,
    PulsarConsumerEditorConfig, SCHEMA_NODE_TYPE
} from "../PulsarDef";
import {EditorWidgetTypedInputType} from "node-red";

/**
 * Type definition for EditorRED, imported from 'node-red'.
 */
type EditorRED = import('node-red').EditorRED

/**
 * Declaration for the RED constant of type EditorRED.
 */
declare const RED: EditorRED


RED.nodes.registerType<PulsarConsumerEditorConfig>(CONSUMER_NODE_TYPE, {
    category: PULSAR_NODE_CATEGORY,
    defaults: {
        name: {value: ''},
        clientNodeId: {value: '', type: CLIENT_NODE_TYPE, required: true},
        schemaNodeId: {value: '', type: SCHEMA_NODE_TYPE, required: false},
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
        interface Field {
            name: string
            type: EditorWidgetTypedInputType
        }
        //For boolean and number fields, the editor needs to be registered
        const fields: Field[] = [
            {name: 'ackTimeoutMs', type: 'num'},
            {name: 'nAckRedeliverTimeoutMs', type: 'num'},
            {name: 'receiverQueueSize', type: 'num'},
            {name: 'receiverQueueSizeAcrossPartitions', type: 'num'},
            {name: 'readCompacted', type: 'bool'},
            {name: 'maxPendingChunkedMessage', type: 'num'},
            {name: 'autoAckOldestChunkedMessageOnQueueFull', type: 'num'},
            {name: 'batchIndexAckEnabled', type: 'bool'},
        ]
        fields.forEach(function (field) {
            let input = $("#node-config-input-" + field.name);
            input.typedInput({
                default: field.type,
                types: [field.type],
                typeField: '#node-config-input-' + field.name + '-type'
            });
            input.typedInput('width', '80px');
        })
        $("#node-config-input-subscription-type").typedInput({
            default: 'Shared',
            types: [{
                value: 'Shared',
                options: [
                    {value: 'Shared', label: 'Shared'},
                    {value: 'Failover', label: 'Failover'},
                    {value: 'KeyShared', label: 'KeyShared'}
                ]
            }]
        })
        $("#node-config-input-subscription-initial-position").typedInput({
            default: 'Latest',
            types: [{
                value: 'Latest',
                options: [
                    {value: 'Latest', label: 'Latest'},
                    {value: 'Earliest', label: 'Earliest'}
                ]
            }]
        })
        $("#node-config-input-regex-subscription-mode").typedInput({
            default: 'AllTopics',
            types: [{
                value: 'AllTopics',
                options: [
                    {value: 'AllTopics', label: 'AllTopics'},
                    {value: 'PersistentOnly', label: 'PersistentOnly'},
                    {value: 'NonPersistentOnly', label: 'NonPersistentOnly'}
                ]
            }]
        })
        $("#node-config-input-crypto-failure-action").typedInput({
            default: 'FAIL',
            types: [{
                value: 'FAIL',
                options: [
                    {value: 'FAIL', label: 'FAIL'},
                    {value: 'CONSUME', label: 'CONSUME'}
                ]
            }]
        })
    }
})
