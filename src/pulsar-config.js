module.exports = function(RED) {
    function PulsarConfigNode(n) {
        RED.nodes.createNode(this,n);
        this.serviceUrl = n.serviceUrl;
        this.adminUrl = n.adminUrl;
    }
    RED.nodes.registerType("pulsar-config", PulsarConfigNode);
}