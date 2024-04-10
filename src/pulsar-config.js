/// <reference types="pulsar-client" />
const Pulsar = require('pulsar-client');

module.exports = function(RED) {
    function PulsarConfigNode(parameters) {
        RED.nodes.createNode(this, parameters);
        const node = this;
        node.on('close', function(removed, done) {
            if (node.client && removed) {
                node.client.close().then(() => {
                    done();
                }).catch((e) => {
                    done(e);
                });
            } else {
                done();
            }
        });
        try {

            Pulsar.Client.setLogHandler((level, file, line, message) => {
                switch (level) {
                case Pulsar.LogLevel.DEBUG:
                    node.debug(message);
                    break;
                case Pulsar.LogLevel.INFO:
                    node.log(message);
                    break;
                case Pulsar.LogLevel.WARN:
                    node.warn(message);
                    break;
                case Pulsar.LogLevel.ERROR:
                    node.error(message);
                    break;
                }
            });
            node.client = new Pulsar.Client({
                serviceUrl: parameters.serviceUrl,
                authentication: buildAuthentication(parameters.authentication),
                operationTimeoutSeconds: parameters.operationTimeoutSeconds,
                ioThreads: parameters.ioThreads,
                messageListenerThreads: parameters.messageListenerThreads,
                concurrentLookupRequest: parameters.concurrentLookupRequest,
                useTls: parameters.useTls,
                tlsTrustCertsFilePath: parameters.tlsTrustCertsFilePath,
                tlsValidateHostname: parameters.tlsValidateHostname,
                tlsAllowInsecureConnection: parameters.tlsAllowInsecureConnection,
                statsIntervalSeconds: parameters.statsIntervalSeconds
            });
        } catch (e) {
            node.error('Error creating pulsar client: ' + e);
        }
    }

    function buildAuthentication(authentication) {
        return undefined;
    }

    RED.nodes.registerType("pulsar-config", PulsarConfigNode);
};

