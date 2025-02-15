import * as NodeRED from 'node-red';
import {
  AuthenticationImpl,
  PulsarAuthenticationConfig,
  PulsarAuthenticationId,
} from '../PulsarDefinition';
import {
  AuthenticationOauth2,
  AuthenticationTls,
  AuthenticationToken,
} from 'pulsar-client';
import { loadToken, parseToken } from '../Token';

type RuntimeNode = NodeRED.Node<AuthenticationImpl>;

export = (RED: NodeRED.NodeAPI): void => {
  RED.nodes.registerType(
    PulsarAuthenticationId,
    function (this: RuntimeNode, config: PulsarAuthenticationConfig): void {
      RED.nodes.createNode(this, config);
      this.debug(
        'Resolving authentication [config: ' + JSON.stringify(config) + ']',
      );
      this.credentials = resolveAuthentication(config, (error: string) => {
        this.error(error);
      });
    },
  );
};

function resolveAuthentication(
  config: PulsarAuthenticationConfig,
  errorHandler: (error: string) => void,
): AuthenticationImpl {
  switch (config.authType) {
    case 'Token':
      return createAuthenticationToken(config, errorHandler);
    case 'Oauth2':
      if (!config.oauthType || !config.oauthIssuerUrl) {
        return noAuthentication();
      }
      return new AuthenticationOauth2({
        type: config.oauthType,
        issuer_url: config.oauthIssuerUrl,
        client_id: config.oauthClientId,
        client_secret: config.oauthClientSecret,
        private_key: config.oauthPrivateKey,
        audience: config.oauthAudience,
        scope: config.oauthScope,
      });
    case 'TLS':
      if (!config.tlsCertificatePath || !config.tlsPrivateKeyPath) {
        return noAuthentication();
      }
      return new AuthenticationTls({
        certificatePath: config.tlsCertificatePath,
        privateKeyPath: config.tlsPrivateKeyPath,
      });
  }
}

function createAuthenticationToken(
  config: PulsarAuthenticationConfig,
  errorHandler: (error: string) => void,
): AuthenticationImpl {
  if (!config.jwtToken) {
    return noAuthentication();
  }
  const token = parseToken(config.jwtToken);
  const tokenContent = loadToken(token, errorHandler);
  if (!tokenContent) {
    return noAuthentication();
  }
  return new AuthenticationToken({ token: tokenContent });
}

function noAuthentication(): AuthenticationImpl {
  return {
    blank: true,
  };
}
