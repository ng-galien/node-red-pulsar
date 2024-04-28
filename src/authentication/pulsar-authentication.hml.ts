import {EditorNodeInstance} from "node-red";
import {PulsarAuthenticationEditorConfig} from "../PulsarDef";

type EditorRED = import('node-red').EditorRED

declare const RED: EditorRED


function nonNullString(this: EditorNodeInstance<PulsarAuthenticationEditorConfig>, value: string): boolean {
    return value !== undefined && value !== ''
}

function urlString(this: EditorNodeInstance<PulsarAuthenticationEditorConfig>, value: string): boolean {
    return value !== undefined && value.match(/^https?:\/\/.+/) !== null
}

function pathString(this: EditorNodeInstance<PulsarAuthenticationEditorConfig>, value: string): boolean {
    return value !== undefined && value.match(/^\/.+/) !== null
}

RED.nodes.registerType<PulsarAuthenticationEditorConfig>('pulsar-authentication', {
    category: 'config',
    defaults: {
        name: {value: ''},
        authType: {value: 'none', required: true},
        jwtToken: {value: undefined, required: false, validate: nonNullString},
        oauthType: {value: undefined, required: false, validate: nonNullString},
        oauthIssuerUrl: {value: '', required: false, validate: urlString},
        oauthClientId: {value: undefined, required: false, validate: nonNullString},
        oauthClientSecret: {value: undefined, required: false, validate: nonNullString},
        oauthPrivateKey: {value: undefined, required: false, validate: nonNullString},
        oauthAudience: {value: undefined, required: false, validate: nonNullString},
        oauthScope: {value: undefined, required: false, validate: nonNullString},
        tlsCertificatePath: {value: undefined, required: false, validate: pathString},
        tlsPrivateKeyPath: {value: undefined, required: false, validate: pathString},
    },
    label: function () {
        return this.name || 'pulsar-authentication'
    },
    oneditprepare: function () {
        function updateJwtToken(show: boolean) {
            $(".jwt-token").toggle(show)
        }
        function updateOauth(show: boolean) {
            $(".oauth").toggle(show)
        }
        function updateTls(show: boolean) {
            $(".tls").toggle(show)
        }
        function updateOauthType() {
            const type = $("#node-config-input-oauth-type").val()
            switch (type) {
                case "None":
                    updateJwtToken(false)
                    updateOauth(false)
                    updateTls(false)
                    break
                case "Token":
                    updateJwtToken(true)
                    updateOauth(false)
                    updateTls(false)
                    break
                case "OAuth2":
                    updateJwtToken(false)
                    updateOauth(true)
                    updateTls(false)
                    break
                case "TLS":
                    updateJwtToken(false)
                    updateOauth(false)
                    updateTls(true)
                    break

            }
        }
        const select = $("#node-config-input-authentication-type").typedInput({
            default: 'none',
            types: [{
                value: 'none',
                options: [
                    {value: 'none', label: 'None'},
                    {value: 'token', label: 'Token'},
                    {value: 'tls', label: 'TLS'},
                    {value: 'oauth2', label: 'OAuth2'}
                ]
            }]
        });
        select.on('change', updateOauthType)
    },
})
