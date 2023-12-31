const helper = require("node-red-node-test-helper");
const pulsarConsumerNode = require("../src/pulsar-consumer.js");
const pulsarConfigNode = require("../src/pulsar-config.js");
const Pulsar = require('pulsar-client');
const { createPulsarContainer, createTopic } = require("./pulsar-container.js");
const {stopPulsarContainer} = require("./pulsar-container");


helper.init(require.resolve('node-red'), {
    functionGlobalContext: { os:require('os') }
});

describe('pulsar-consumer Node', function () {


    // let container;
    let pulsarPort = 6650;
    let topic = "test"+Math.random();
    let container;

    before(function (done) {
        this.timeout(60000);
        createPulsarContainer(done, function (pulsar) {
            pulsarPort = pulsar.getMappedPort(6650);
            container = pulsar;
            createTopic(pulsar, topic, done, function () {
                helper.startServer(done);
            });
        });
    });

    afterEach(function(done) {
        console.log("Unloading node");
        helper.unload().then(function() {
            done();
        });
    });

    after( function(done) {
        helper.stopServer(function () {
            console.log("Stopping container");
            if(container) {
                stopPulsarContainer(container, done);
            } else {
                done();
            }
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
        const flow = [
            {id: "n1", type: "pulsar-consumer", broker: "n2", topic: topic, subscription: "test", wires: [["n3"]]},
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
        sendMsg(pulsarPort, topic, {payload: "test"}, done);
    });
});

function sendMsg(port, topic, message, done) {
    const serviceUrl = "pulsar://localhost:" + port;
    const client = new Pulsar.Client({
        serviceUrl: serviceUrl,
        operationTimeoutSeconds: 30
    });
    client.createProducer({
        topic: topic
    }).then(producer => {
        console.log("Producer created");
        producer.send({
            data: Buffer.from(JSON.stringify(message))
        }).then(() => {
            client.close();
        }).catch(e => {
            console.error("Error sending message: " + e);
            done(e);
        });
    }).catch(e => {
        client.close();
        done(e);
    });
}
