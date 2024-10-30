import * as NodeRED from 'node-red'
import {
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



type RuntimeNode = NodeRED.Node<Client>


function createPulsarConfigNode(auth: AuthenticationImpl | undefined, config: PulsarClientConfig): ClientConfig {
    return {
        serviceUrl: config.serviceUrl,
        authentication: auth,
        operationTimeoutSeconds: parseNumber(config.operationTimeoutSeconds),
        ioThreads: parseNumber(config.ioThreads),
        messageListenerThreads: parseNumber(config.messageListenerThreads),
        concurrentLookupRequest: parseNumber(config.concurrentLookupRequest),
        useTls: parseBoolean(config.useTls),
        tlsTrustCertsFilePath: config.tlsTrustCertsFilePath,
        tlsValidateHostname: parseBoolean(config.tlsValidateHostname),
        tlsAllowInsecureConnection: parseBoolean(config.tlsAllowInsecureConnection),
        statsIntervalInSeconds: parseNumber(config.statsIntervalInSeconds),
        listenerName: parseNonEmptyString(config.listenerName),
    }
}

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType(PulsarClientId,
        function (this: RuntimeNode, config: PulsarClientConfig): void {
            RED.nodes.createNode(this, config)
            this.debug('Getting authentication [config: ' + JSON.stringify(config) + ']')
            const authentication = getAuthentication(this, RED, config)
            this.debug('Creating pulsar client with authentication: ' + JSON.stringify(authentication))
            const client = createClient(this, createPulsarConfigNode(authentication, config))
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

function getAuthentication(node: RuntimeNode, RED: NodeRED.NodeAPI, config: PulsarClientConfig): AuthenticationImpl | undefined {
    if(!config.authenticationNodeId) {
        node.debug('No authentication node id provided')
        return undefined
    }
    node.trace('Getting authentication node with id: ' + config.authenticationNodeId)
    const authNode = RED.nodes.getNode(config.authenticationNodeId) as NodeRED.Node<AuthenticationImpl>
    if(!authNode) {
        node.error('No authentication node found with id: ' + config.authenticationNodeId)
        return undefined
    }
    const auth = authNode.credentials
    if((auth as NoAuthentication).blank) {
        node.debug('No authentication provided')
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
        node.debug('Creating pulsar client, config: ' + JSON.stringify(clientConfig))
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
    if(!node) {
        done()
        return
    }
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
