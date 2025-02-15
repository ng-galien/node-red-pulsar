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
function displayTlsFields(show: boolean): void {
    $(".tls").toggle(show)
}

/**
 * Registration of the 'pulsar-client' type with its configuration.
 */
RED.nodes.registerType<PulsarClientEditorConfig>(CLIENT_ID, {
    category: PULSAR_CONFIG,
    icon: 'font-awesome/fa-server',
    color: PULSAR_COLOR,
    defaults: {
        name: {value: ''},
        authenticationNodeId: {value: '', type: AUTHENTICATION_ID, required: false},
        serviceUrl: {value: '', required: true},
        serviceUrlTypedInput: {value: 'str', required: false},
        operationTimeoutSeconds: {value: '30', required: false, validate: RED.validators.number(true)},
        ioThreads: {value: '1', required: false, validate: RED.validators.number(true)},
        messageListenerThreads: {value: '1', required: false, validate: RED.validators.number(true)},
        concurrentLookupRequest: {value: '50000', required: false, validate: RED.validators.number(true)},
        useTls: {value: 'false', required: true, validate: RED.validators.typedInput('bool')},
        tlsTrustCertsFilePath: {value: '', required: false},
        tlsValidateHostname: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        tlsAllowInsecureConnection: {value: 'false', required: false, validate: RED.validators.typedInput('bool')},
        statsIntervalInSeconds: {value: '60', required: false, validate: RED.validators.number(true)},
        listenerName: {value: '', required: false},
    },
    label: function () {
        return this.name || 'pulsar-client'
    },
    oneditprepare: function () {
        const fields: TypedField[] = [
            {name: 'serviceUrl', type: ['str', "env", "flow", "global"], value: this.serviceUrl, defaultType: this.serviceUrlTypedInput as EditorWidgetTypedInputType},
            {name: 'operationTimeoutSeconds', type: 'num', value: this.operationTimeoutSeconds},
            {name: 'ioThreads', type: 'num', value: this.ioThreads},
            {name: 'messageListenerThreads', type: 'num', value: this.messageListenerThreads},
            {name: 'concurrentLookupRequest', type: 'num', value: this.concurrentLookupRequest},
            {name: 'statsIntervalInSeconds', type: 'num', value: this.statsIntervalInSeconds},
            {name: 'useTls', type: 'bool', value: this.useTls},
            {name: 'tlsValidateHostname', type: 'bool', value: this.tlsValidateHostname},
            {name: 'tlsAllowInsecureConnection', type: 'bool', value: this.tlsAllowInsecureConnection},
        ];
        configureTypedFields(true, fields)
        const useTls = this.useTls === 'true';
        displayTlsFields(useTls);

        $("#node-config-input-useTls").on('change', function (event) {
            displayTlsFields($(event.target).val() === 'true');
        })
    },
    oneditsave: function () {
        this.serviceUrlTypedInput = getPropertyType(true, 'serviceUrl')
    },
})
