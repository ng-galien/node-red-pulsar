import * as NodeRED from "node-red";
import {AuthenticationImpl, PulsarAuthenticationConfig, PulsarAuthenticationId} from "../PulsarDefinition";
import {AuthenticationOauth2, AuthenticationTls, AuthenticationToken} from "pulsar-client";
import {loadToken, parseToken} from "../Token";

type RuntimeNode = NodeRED.Node<AuthenticationImpl>

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarAuthenticationId,
        function (this: RuntimeNode, config: PulsarAuthenticationConfig): void {
            RED.nodes.createNode(this, config)
            resolveAuthentication(config).then(
                (auth) => {
                    this.credentials = auth
                },
                (error) => {
                    this.error(error)
                }
            )
        }
    )
}

async function resolveAuthentication(config: PulsarAuthenticationConfig): Promise<AuthenticationImpl> {
    switch (config.authType) {
    case 'Token':
        return createAuthenticationToken(config)
    case 'Oauth2':
        if(!config.oauthType || !config.oauthIssuerUrl) {
            return {}
        }
        return new AuthenticationOauth2({
            type: config.oauthType,
            issuer_url: config.oauthIssuerUrl,
            client_id: config.oauthClientId,
            client_secret: config.oauthClientSecret,
            private_key: config.oauthPrivateKey,
            audience: config.oauthAudience,
            scope: config.oauthScope
        })
    case 'TLS':
        if(!config.tlsCertificatePath || !config.tlsPrivateKeyPath) {
            return {}
        }
        return new AuthenticationTls({
            certificatePath: config.tlsCertificatePath,
            privateKeyPath: config.tlsPrivateKeyPath
        })
    }
}

async function createAuthenticationToken(config: PulsarAuthenticationConfig): Promise<AuthenticationImpl> {
    if(!config.jwtToken) {
        return {}
    }
    const token = parseToken(config.jwtToken)
    const tokenContent = await loadToken(token)
    return new AuthenticationToken({token: tokenContent})
}
