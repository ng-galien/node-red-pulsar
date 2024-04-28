import {AUTHENTICATION_NODE_TYPE, CLIENT_NODE_TYPE, PulsarClientEditorConfig} from "../PulsarDef";
import {EditorNodeInstance, EditorWidgetTypedInputType} from "node-red";



/**
 * Type definition for EditorRED, imported from 'node-red'.
 */
type EditorRED = import('node-red').EditorRED

/**
 * Declaration for the RED constant of type EditorRED.
 */
declare const RED: EditorRED

/**
 * Function to validate the Pulsar URL.
 * @param {string} value - The URL to be validated.
 * @returns {boolean} - Returns true if the URL is valid, false otherwise.
 */
function validatePulsarUrl(this: EditorNodeInstance<PulsarClientEditorConfig>, value: string): boolean {
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
RED.nodes.registerType<PulsarClientEditorConfig>(CLIENT_NODE_TYPE, {
    category: 'config',
    defaults: {
        name: {value: ''},
        serviceUrl: {value: '', required: true, validate: validatePulsarUrl},
        authenticationNodeId: {value: '', type: AUTHENTICATION_NODE_TYPE, required: false},
        operationTimeoutSeconds: {value: 30, required: false, validate: RED.validators.number()},
        ioThreads: {value: 1, required: false, validate: RED.validators.number()},
        messageListenerThreads: {value: 1, required: false, validate: RED.validators.number()},
        concurrentLookupRequest: {value: 5000, required: false, validate: RED.validators.number()},
        useTls: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        tlsTrustCertsFilePath: {value: '', required: false},
        tlsValidateHostname: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        tlsAllowInsecureConnection: {value: false, required: false, validate: RED.validators.typedInput('bool')},
        statsIntervalInSeconds: {value: 60, required: false, validate: RED.validators.number()},
        listenerName: {value: '', required: false}
    },
    label: function () {
        return this.name || 'pulsar-client'
    },
    oneditprepare: function () {
        interface Field {
            name: string
            type: EditorWidgetTypedInputType
        }
        const fields: Field[] = [
            {name: 'operationTimeoutSeconds', type: 'num'},
            {name: 'ioThreads', type: 'num'},
            {name: 'messageListenerThreads', type: 'num'},
            {name: 'concurrentLookupRequest', type: 'num'},
            {name: 'statsIntervalInSeconds', type: 'num'},
            {name: 'useTls', type: 'bool'},
            {name: 'tlsValidateHostname', type: 'bool'},
            {name: 'tlsAllowInsecureConnection', type: 'bool'}
        ];
        fields.forEach(function (field) {
            let input = $("#node-config-input-" + field.name);
            input.typedInput({
                default: field.type,
                types: [field.type],
                typeField: '#node-config-input-' + field.name + '-type'
            });
            input.typedInput('width', '80px');
        });
        const useTls = this.useTls || false;
        displayTlsFields(useTls);

        $("#node-config-input-useTls").on('change', function (event) {
            displayTlsFields($(event.target).val() === 'true');
        })
    }
})

// <script type="text/javascript">
//     RED.nodes.registerType('pulsar-config', {
//         category: 'config',
//         color: '#188fff',
//         defaults: {
//             serviceUrl: {value: "", required: true},
//             adminUrl: {value: "", required: false},
//             authentication: {value: null, required: false, validate: validateAuthentication},
//             operationTimeoutSeconds: {value: null, required: false},
//             ioThreads: {value: null, required: false},
//             messageListenerThreads: {value: null, required: false},
//             concurrentLookupRequest: {value: null, required: false},
//             useTls: {value: null, required: false},
//             tlsTrustCertsFilePath: {value: null, required: false},
//             tlsValidateHostname: {value: null, required: false},
//             tlsAllowInsecureConnection: {value: null, required: false},
//             statsIntervalInSeconds: {value: null, required: false},
//         },
//         label: function () {
//             return this.serviceUrl || 'pulsar-client-config';
//         },
//         oneditprepare: function () {
//             $("#node-config-input-serviceUrl").typedInput({
//                 default: 'str',
//                 types: ['str']
//             });
//             $("#node-config-input-authentication").typedInput({
//                 default: 'json',
//                 types: ['json'],
//                 typeField: '#node-config-input-authentication-type'
//             });
//             // Number fields for timeout and threads
//             var numberFields = [
//                 'operationTimeoutSeconds',
//                 'ioThreads',
//                 'messageListenerThreads',
//                 'concurrentLookupRequest',
//                 'statsIntervalInSeconds'
//             ];
//             numberFields.forEach(function (field) {
//                 let input = $("#node-config-input-" + field);
//                 input.typedInput({

//                     default: 'num',
//                     types: ['num'],
//                     typeField: '#node-config-input-' + field + '-type'
//                 });
//                 input.typedInput('width', '80px');
//             });
//             // Boolean fields for TLS settings
//             var booleanFields = [
//                 'useTls',
//                 'tlsValidateHostname',
//                 'tlsAllowInsecureConnection'
//             ];
//             booleanFields.forEach(function (field) {
//                 let input = $("#node-config-input-" + field);
//                 input.typedInput({
//                     default: 'bool',
//                     types: ['bool'],
//                     typeField: '#node-config-input-' + field + '-type'
//                 });
//                 input.typedInput('width', '80px');
//             });
//         }
//     });

//     function valueIsBlank(value) {
//         return value === null || value === undefined || value === "";
//     }

//     function validateAuthentication(value) {
//         if (valueIsBlank(value)) {
//             return true;
//         }
//         try {
//             const auth = JSON.parse(value);
//             if (auth === null || typeof auth !== "object") {
//                 return false;
//             }
//             if (!auth.type && !auth.config) {
//                 return false;
//             }
//             switch (auth.type) {
//             case "AuthenticationTls" :
//                 if (!auth.config.certificatePath || !auth.config.privateKeyPath) {
//                     return false;
//                 }
//                 break;
//             case "AuthenticationAthenz" :
//                 if (!auth.config.tenantDomain
//                     && !auth.config.tenantService
//                     && !auth.config.providerDomain
//                     && !auth.config.privateKey
//                     && !auth.config.ztsUrl) {
//                     return false;
//                 }
//                 break;
//             case "AuthenticationToken" :
//                 if (!auth.config.token) {
//                     return false;
//                 }
//                 break;
//             case "AuthenticationOAuth2" :
//                 if (!auth.config.type
//                     && !auth.config.issuer_url) {
//                     return false;
//                 }
//                 break;
//             default:
//                 return false;
//             }
//         } catch (e) {
//             return false;
//         }
//     }
