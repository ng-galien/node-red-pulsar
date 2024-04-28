import * as NodeRED from "node-red";
import {AUTHENTICATION_NODE_TYPE, AuthenticationImpl, PulsarAuthentication} from "../PulsarDef";
import {AuthenticationOauth2, AuthenticationTls, AuthenticationToken} from "pulsar-client";


export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(AUTHENTICATION_NODE_TYPE,
        function (this: NodeRED.Node<AuthenticationImpl>, config: PulsarAuthentication): void {
            function resolveAuthentication(config: PulsarAuthentication) {
                switch (config.authType) {
                    case 'none':
                        return {}
                    case 'token':
                        if(!config.jwtToken) {
                            return {}
                        }
                        return new AuthenticationToken({token: config.jwtToken})
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
            this.credentials = resolveAuthentication(config)
        }
    )
}
