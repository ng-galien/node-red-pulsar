type PulsarAuthenticationEditorConfig =
  import('../PulsarDefinition').PulsarAuthenticationEditorConfig;
type AuthenticationType =
  import('../PulsarDefinition').PulsarAuthenticationType;

RED.nodes.registerType<PulsarAuthenticationEditorConfig>(AUTHENTICATION_ID, {
  category: PULSAR_CONFIG,
  icon: 'font-awesome/fa-key',
  color: PULSAR_COLOR,
  defaults: {
    name: { value: '' },
    authType: { value: '', required: true },
    jwtToken: { value: '', required: false },
    oauthType: { value: '', required: false },
    oauthIssuerUrl: { value: '', required: false },
    oauthClientId: { value: undefined, required: false },
    oauthClientSecret: { value: undefined, required: false },
    oauthPrivateKey: { value: undefined, required: false },
    oauthAudience: { value: undefined, required: false },
    oauthScope: { value: undefined, required: false },
    tlsCertificatePath: { value: undefined, required: false },
    tlsPrivateKeyPath: { value: undefined, required: false },
  },
  label: function () {
    return this.name || 'pulsar-authentication';
  },
  oneditprepare: function () {
    const authType = $('#node-config-input-authType');
    authType.on('change', function () {
      const input = authType.typedInput('value') as AuthenticationType;
      updateOauthType(input);
    });
    function updateJwtToken(show: boolean): void {
      $('.jwt-token').toggle(show);
    }
    function updateOauth(show: boolean): void {
      $('.oauth').toggle(show);
    }
    function updateTls(show: boolean): void {
      $('.tls').toggle(show);
    }
    function updateOauthType(type: AuthenticationType): void {
      switch (type) {
        case 'Token':
          updateJwtToken(true);
          updateOauth(false);
          updateTls(false);
          break;
        case 'Oauth2':
          updateJwtToken(false);
          updateOauth(true);
          updateTls(false);
          break;
        case 'TLS':
          updateJwtToken(false);
          updateOauth(false);
          updateTls(true);
          break;
      }
    }
    configureMandatoryEnumField<AuthenticationType>(true, 'authType', [
      'Token',
      'Oauth2',
      'TLS',
    ]);
  },
});
