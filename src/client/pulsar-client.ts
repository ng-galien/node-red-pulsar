import * as NodeRED from 'node-red'
import {
    AuthenticationOauth2,
    AuthenticationTls,
    AuthenticationToken,
    Client,
    ClientConfig,
    LogLevel
} from "pulsar-client";
import {AuthenticationImpl, NoAuthentication, PulsarClientConfig} from "../PulsarDef";

type ClientAuthentication = AuthenticationToken | AuthenticationOauth2 | AuthenticationTls | undefined

export = (RED: NodeRED.NodeAPI): void => {
    RED.nodes.registerType('pulsar-client',
        function (this: NodeRED.Node<Client>, config: PulsarClientConfig): void {
            const authNode = RED.nodes.getNode(config.authenticationNodeId) as NodeRED.Node<AuthenticationImpl>
            RED.nodes.createNode(this, config)
            config.authentication = resolveAuthentication(authNode)
            createClient(this, config)
            this.on('close', (done) => {
                closeClient(this, done)
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
function createClient(node: NodeRED.Node<Client>, clientConfig: ClientConfig) {
    try {
        const client = new Client(clientConfig)
        mapClientLoginToNode(node)
        node.credentials = client
    }
    catch (e) {
        node.error('Error creating pulsar client: ' + e)
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
    if (node.credentials) {
        node.credentials.close().then(() => {
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

// module.exports = function(RED) {
//     function PulsarConfigNode(parameters) {
//         RED.nodes.createNode(this, parameters);
//         const node = this;
//         node.on('close', function(removed, done) {
//             if (node.client && removed) {
//                 node.client.close().then(() => {
//                     done();
//                 }).catch((e) => {
//                     done(e);
//                 });
//             } else {
//                 done();
//             }
//         });
//         try {
//
//             Pulsar.Client.setLogHandler((level, file, line, message) => {
//                 switch (level) {
//                 case Pulsar.LogLevel.DEBUG:
//                     node.debug(message);
//                     break;
//                 case Pulsar.LogLevel.INFO:
//                     node.log(message);
//                     break;
//                 case Pulsar.LogLevel.WARN:
//                     node.warn(message);
//                     break;
//                 case Pulsar.LogLevel.ERROR:
//                     node.error(message);
//                     break;
//                 }
//             });
//             node.client = new Pulsar.Client({
//                 serviceUrl: parameters.serviceUrl,
//                 authentication: buildAuthentication(parameters.authentication),
//                 operationTimeoutSeconds: parameters.operationTimeoutSeconds,
//                 ioThreads: parameters.ioThreads,
//                 messageListenerThreads: parameters.messageListenerThreads,
//                 concurrentLookupRequest: parameters.concurrentLookupRequest,
//                 useTls: parameters.useTls,
//                 tlsTrustCertsFilePath: parameters.tlsTrustCertsFilePath,
//                 tlsValidateHostname: parameters.tlsValidateHostname,
//                 tlsAllowInsecureConnection: parameters.tlsAllowInsecureConnection,
//                 statsIntervalSeconds: parameters.statsIntervalSeconds
//             });
//         } catch (e) {
//             node.error('Error creating pulsar client: ' + e);
//         }
//     }
//
//     function buildAuthentication(authentication) {
//         return undefined;
//     }
//
//     RED.nodes.registerType("pulsar-client", PulsarConfigNode);
// };

