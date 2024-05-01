import * as NodeRED from 'node-red'
import {
    AuthenticationOauth2,
    AuthenticationTls,
    AuthenticationToken,
    Client,
    ClientConfig,
    LogLevel
} from "pulsar-client";
import {
    AuthenticationImpl,
    NoAuthentication,
    PulsarClientConfig,
    PulsarClientId
} from "../PulsarDefinition";
import {parseBoolean, parseNumber, parseNonEmptyString} from "../PulsarConfig";

type ClientAuthentication = AuthenticationToken | AuthenticationOauth2 | AuthenticationTls | undefined

type RuntimeNode = NodeRED.Node<Client>

type AuthenticationNode = NodeRED.Node<AuthenticationImpl>

function createPulsarConfigNode(auth: AuthenticationNode, config: PulsarClientConfig): ClientConfig {
    return {
        serviceUrl: config.serviceUrl,
        authentication: resolveAuthentication(auth),
        operationTimeoutSeconds: parseNumber(config.operationTimeoutSeconds),
        ioThreads: parseNumber(config.ioThreads),
        messageListenerThreads: parseNumber(config.messageListenerThreads),
        concurrentLookupRequest: parseNumber(config.concurrentLookupRequest),
        useTls: parseBoolean(config.useTls),
        tlsTrustCertsFilePath: config.tlsTrustCertsFilePath,
        tlsValidateHostname: parseBoolean(config.tlsValidateHostname),
        tlsAllowInsecureConnection: parseBoolean(config.tlsAllowInsecureConnection),
        statsIntervalInSeconds: parseNumber(config.statsIntervalInSeconds),
        listenerName: parseNonEmptyString(config.listenerName)
    }
}

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarClientId,
        function (this: RuntimeNode, config: PulsarClientConfig): void {
            const authNode = RED.nodes.getNode(config.authenticationNodeId) as NodeRED.Node<AuthenticationImpl>
            RED.nodes.createNode(this, config)
            const client = createClient(this, createPulsarConfigNode(authNode, config))
            if(client) {
                this.credentials = client
                mapClientLoginToNode(this)
            }
            this.on('close', (removed: boolean, done:() => void) => {
                if (!removed) {
                    closeClient(this, done)
                }
            })
        }
    )
}


/**
 * Resolves the authentication based on the provided Node.
 *
 * @param {NodeRED.Node<AuthenticationImpl>} [node] - The Node containing the authentication information.
 * @return {ClientAuthentication} - The resolved ClientAuthentication. Returns undefined if no authentication is provided or if the authentication is NoAuthentication.
 */
function resolveAuthentication(node?: NodeRED.Node<AuthenticationImpl>): ClientAuthentication {
    if(!node) {
        return undefined
    }
    const auth = node.credentials
    //If the authentication is NoAuthentication, return undefined
    if((auth as NoAuthentication).blank) {
        return undefined
    }
    return auth
}


/**
 * Creates a new Pulsar client and sets it as credentials for the provided NodeRED node.
 *
 * @param {NodeRED.Node<Client>} node - The NodeRED node to set the Pulsar client credentials on.
 * @param {ClientConfig} clientConfig - The configuration object for creating the new Pulsar client.
 *
 * @return {void} - No return value
 *
 * @throws {Error} If there is an error creating the Pulsar client.
 */
function createClient(node: NodeRED.Node<Client>, clientConfig: ClientConfig): Client | undefined {
    try {
        node.log('Creating pulsar client')
        node.log('Client config: ' + JSON.stringify(clientConfig))
        return new Client(clientConfig)
    }
    catch (e) {
        node.error('Error creating pulsar client: ' + e)
        return undefined
    }
}


/**
 * Closes the client associated with the given NodeRED node.
 *
 * @param {NodeRED.Node<Client>} node - The NodeRED node to close the client for.
 * @param {Function} done - The callback function to be called after the client is closed.
 * @return {void}
 */
function closeClient(node: NodeRED.Node<Client>, done: () => void): void {
    const client = node.credentials
    if (client) {
        client.close().then(() => {
            done()
        }).catch((e) => {
            node.error(e)
            done()
        })
    } else {
        done()
    }
}

/**
 * Map the client log to the node
 * @param node the node to map the client log to
 */
function mapClientLoginToNode(node: NodeRED.Node): void {
    Client.setLogHandler((level, _file, _line, message) => {
        switch (level) {
        case LogLevel.DEBUG:
            node.debug(message)
            break
        case LogLevel.INFO:
            node.log(message)
            break
        case LogLevel.WARN:
            node.warn(message)
            break
        case LogLevel.ERROR:
            node.error(message)
            break
        }
    });
}
