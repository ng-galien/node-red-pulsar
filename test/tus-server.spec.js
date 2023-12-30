const helper = require("node-red-node-test-helper");
const { GenericContainer } = require("testcontainers");
const pulsarConsumerNode = require("../src/pulsar-consumer.js");
const pulsarConfigNode = require("../src/pulsar-config.js");

helper.init(require.resolve('node-red'), {
    functionGlobalContext: { os:require('os') }
});

let container;
let pulsarPort = 6650;


describe('pulsar-consumer Node', function () {

    before(function (done) {
        this.timeout(60000);
        new GenericContainer("apachepulsar/pulsar:3.1.1")
            .withExposedPorts(6650, 8080)
            .withCommand(["bin/pulsar", "standalone"])
            .start()
            .then(function (pulsar) {
                container = pulsar;
                pulsarPort = container.getMappedPort(6650);
                container.exec(
                    ["bin/pulsar-admin", "topics", "create", "persistent://public/default/test"]
                ).then(function (result) {
                    if(result.exitCode !== 0) {
                        done(new Error("Error creating topic: " + result.output));
                    }
                    helper.startServer(done);
                }).catch(function (err) {
                    done(err);
                });
            }).catch(function (err) {
                done(err);
        });

    });

    afterEach(function(done) {
        console.log("Unloading node");
        helper.unload().then(function() {
            done();
        });
    });

    after( function(done) {
        this.timeout(60000);
        helper.stopServer(function () {
            console.log("Stopping container");
            container.stop().then(function () {
                console.log("Container stopped");
                done();
            }).catch(function (err) {
                done(err);
            });
        });
    });

    it('should be loaded', async function () {
        const flow = [
            {id: "n1", type: "pulsar-consumer", broker: "n2", topic: "test", subscription: "test", wires: [["n3"]]},
            {id: "n2", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort, wires: [["n1"]]}
        ];
        await helper.load([pulsarConfigNode, pulsarConsumerNode], flow);
        const n1 = helper.getNode("n1");
        try {
            //Node should be loaded
            n1.should.not.be.null;
            //Client should be set
            n1.should.have.property('client');
            //Client should be a pulsar client
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    });
    it('should receive a message',  function (done) {
        this.timeout(60000);
        const flow = [
            {id: "n1", type: "pulsar-consumer", broker: "n2", topic: "test", subscription: "test", wires: [["n3"]]},
            {id: "n2", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort, wires: [["n1"]]},
            {id: "n3", type: "helper"}
        ];
        helper.load([pulsarConfigNode, pulsarConsumerNode], flow, function () {
            try {
                const n1 = helper.getNode("n1");
                //Node should be loaded
                n1.should.not.be.null;
                //Send a message
                const n3 = helper.getNode("n3");
                n3.should.not.be.null;
                n3.on("input", function (msg) {
                    try {
                        console.log("Message received", msg);
                        msg.should.have.property('payload');
                        msg.payload.should.have.property('payload');
                        msg.payload.payload.should.be.equal('test');
                        done();
                    } catch (err) {
                        done(err);
                    }
                });

            } catch (err) {
                done(err);
            }
        });
        sendMsg(container, "test", {payload: "test"});
    });
});

function sendMsg(container, topic, message) {
    return container.exec([
        "bin/pulsar-client", "produce", topic, "--messages", JSON.stringify(message)
    ]).then(result => {
        if(result.exitCode !== 0) {
            throw new Error("Error sending message: " + result.output);
        }
        return result;
    });
}
