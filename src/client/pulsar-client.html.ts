type PulsarClientEditorConfig = import("../PulsarDefinition").PulsarClientEditorConfig


/**
 * Function to validate the Pulsar URL.
 * @param {string} value - The URL to be validated.
 * @returns {boolean} - Returns true if the URL is valid, false otherwise.
 */
function validatePulsarUrl(this: EditorNodeInstance, value: string): boolean {
    return value !== undefined && value.match(/^pulsar:\/\/.+/) !== null
}

/**
 * Function to display TLS fields.
 * @param {boolean} show - Whether to show the fields or not.
 */
function displayTlsFields(show: boolean) {
    $(".tls").toggle(show)
}

/**
 * Registration of the 'pulsar-client' type with its configuration.
 */
RED.nodes.registerType<PulsarClientEditorConfig>(CLIENT_ID, {
    category: 'config',
    icon: 'font-awesome/fa-server',
    color: PULSAR_COLOR,
    defaults: {
        name: {value: ''},
        serviceUrl: {value: '', required: true, validate: validatePulsarUrl},
        authenticationNodeId: {value: '', type: AUTHENTICATION_ID, required: false},
        operationTimeoutSeconds: {value: 30, required: false, validate: RED.validators.number(true)},
        ioThreads: {value: 1, required: false, validate: RED.validators.number(true)},
        messageListenerThreads: {value: 1, required: false, validate: RED.validators.number(true)},
        concurrentLookupRequest: {value: 50000, required: false, validate: RED.validators.number(true)},
        useTls: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        tlsTrustCertsFilePath: {value: '', required: false},
        tlsValidateHostname: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        tlsAllowInsecureConnection: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        statsIntervalInSeconds: {value: 60, required: false, validate: RED.validators.number(true)},
        listenerName: {value: '', required: false, validate: (v) => v === '' || v.match(/^[a-zA-Z0-9_-]+$/) !== null},
    },
    label: function () {
        return this.name || 'pulsar-client'
    },
    oneditprepare: function () {
        const fields: TypedField[] = [
            {name: 'operationTimeoutSeconds', type: 'num'},
            {name: 'ioThreads', type: 'num'},
            {name: 'messageListenerThreads', type: 'num'},
            {name: 'concurrentLookupRequest', type: 'num'},
            {name: 'statsIntervalInSeconds', type: 'num'},
            {name: 'useTls', type: 'bool'},
            {name: 'tlsValidateHostname', type: 'bool'},
            {name: 'tlsAllowInsecureConnection', type: 'bool'}
        ];
        configureTypedFields(true, fields)
        const useTls = this.useTls || false;
        displayTlsFields(useTls);

        $("#node-config-input-useTls").on('change', function (event) {
            displayTlsFields($(event.target).val() === 'true');
        })
    }
})
