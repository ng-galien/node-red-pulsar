const Pulsar = require('pulsar-client');

module.exports = function(RED) {
    function PulsarConfigNode(n) {
        RED.nodes.createNode(this,n);
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
                console.log(level, file, line, message);
            });
            node.client = new Pulsar.Client({
                serviceUrl: n.serviceUrl,
                authentication: buildAuthentication(n.authentication),
                operationTimeoutSeconds: n.operationTimeoutSeconds,
                ioThreads: n.ioThreads,
                messageListenerThreads: n.messageListenerThreads,
                concurrentLookupRequest: n.concurrentLookupRequest,
                useTls: n.useTls,
                tlsTrustCertsFilePath: n.tlsTrustCertsFilePath,
                tlsValidateHostname: n.tlsValidateHostname,
                tlsAllowInsecureConnection: n.tlsAllowInsecureConnection,
                statsIntervalSeconds: n.statsIntervalSeconds
            });
        } catch (e) {
            this.error('Error creating pulsar client: ' + e);
        }
    }
    function buildAuthentication(authentication) {
        return undefined;
    }
    RED.nodes.registerType("pulsar-config", PulsarConfigNode);
};

