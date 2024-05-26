import * as NodeRED from "node-red";
import {AuthenticationImpl, PulsarAuthentication, PulsarAuthenticationId} from "../PulsarDefinition";
import {AuthenticationOauth2, AuthenticationTls, AuthenticationToken} from "pulsar-client";
import {loadToken, parseToken} from "../Token";


export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarAuthenticationId,
        function (this: NodeRED.Node<AuthenticationImpl>, config: PulsarAuthentication): void {
            async function resolveAuthentication(config: PulsarAuthentication): Promise<AuthenticationImpl> {
                switch (config.authType) {
                case 'none':
                    return {}
                case 'token':
                    if(!config.jwtToken) {
                        return {}
                    }
                    const token = parseToken(config.jwtToken)
                    return new AuthenticationToken({token: await loadToken(token)})
                case 'oauth2':
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
                case 'tls':
                    if(!config.tlsCertificatePath || !config.tlsPrivateKeyPath) {
                        return {}
                    }
                    return new AuthenticationTls({
                        certificatePath: config.tlsCertificatePath,
                        privateKeyPath: config.tlsPrivateKeyPath
                    })
                }
            }
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
