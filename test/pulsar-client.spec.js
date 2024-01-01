
const helper = require("node-red-node-test-helper");
const pulsarConsumerNode = require("../src/pulsar-consumer.js");
const pulsarProducerNode = require("../src/pulsar-producer.js");
const pulsarConfigNode = require("../src/pulsar-config.js");
const pulsarSchemaNode = require("../src/pulsar-schema.js");
const Pulsar = require('pulsar-client');
const { createPulsarContainer, createTopic } = require("./pulsar-container.js");
const {stopPulsarContainer} = require("./pulsar-container");
const {schema} = require("avsc");


helper.init(require.resolve('node-red'), {
    functionGlobalContext: { os:require('os') }
});

describe('Pulsar Consumer/Producer', function () {

    // let container;
    let pulsarPort = 6650;
    const topic = "test"+Math.random();
    const consumerSubscription = "test"+Math.random();
    const producerName = "test"+Math.random();
    const jsonSchema = {
        type: "record",
        name: "Test",
        fields: [
            {name: "name", type: "string"},
            {name: "age", type: "int"}
        ]
    };
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

    it('Consumer should be loaded',  function (done) {
        const flow = [
            { id: "consumer", type: "pulsar-consumer", config: "config", schema: "schema", topic: topic, subscription: consumerSubscription, wires: [[], ["status"]] },
            { id: "config", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort },
            { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
            { id: "status", type: "helper" }
        ];
        helper.load([pulsarConfigNode, pulsarSchemaNode, pulsarConsumerNode], flow, function () {
            try {
                //Wait for status message
                const status = helper.getNode("status");
                status.on("input", function (msg) {
                    try {
                        console.log("Message received", msg);
                        msg.should.have.property('topic');
                        msg.topic.should.be.equal('pulsar');
                        msg.should.have.property('payload');
                        msg.payload.should.have.property('type');
                        msg.payload.type.should.be.equal('consumer');
                        msg.payload.should.have.property('status');
                        msg.payload.status.should.be.equal('ready');
                        msg.payload.should.have.property('topic');
                        msg.payload.topic.should.be.equal(topic);
                        msg.payload.should.have.property('subscription');
                        msg.payload.subscription.should.be.equal(consumerSubscription);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            } catch (err) {
                done(err);
            }
        });
    });

    it('Producer should be loaded',  function (done) {
        const flow = [
            { id: "producer", type: "pulsar-producer", config: "config", schema: "schema", topic: topic, producerName: producerName, wires: [["status"]] },
            { id: "config", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort },
            { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
            { id: "status", type: "helper"}
        ];
        helper.load([pulsarConfigNode, pulsarSchemaNode, pulsarProducerNode], flow, function () {
            try {
                //Wait for status message
                const status = helper.getNode("status");
                status.on("input", function (msg) {
                    try {
                        console.log("Message received", msg);
                        msg.should.have.property('topic');
                        msg.topic.should.be.equal('pulsar');
                        msg.should.have.property('payload');
                        msg.payload.should.have.property('type');
                        msg.payload.type.should.be.equal('producer');
                        msg.payload.should.have.property('status');
                        msg.payload.status.should.be.equal('ready');
                        msg.payload.should.have.property('topic');
                        msg.payload.topic.should.be.equal(topic);
                        msg.payload.should.have.property('producerName');
                        msg.payload.producerName.should.be.equal(producerName);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            } catch (err) {
                done(err);
            }
        });
    });

    it('Consumer should receive a message',  function (done) {
        const flow = [
            { id: "consumer", type: "pulsar-consumer", config: "config", topic: topic, schema: schema, subscription: consumerSubscription, wires: [["receiver"]] },
            { id: "config", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort },
            { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
            { id: "receiver", type: "helper"}
        ];
        helper.load([pulsarConfigNode, pulsarSchemaNode, pulsarConsumerNode], flow, function () {
            try {
                const name = "test"+Math.random();
                const age = Math.floor(Math.random() * 100);
                const message = {
                    name: name,
                    age: age
                };
                const consumer = helper.getNode("consumer");
                //Node should be loaded
                consumer.should.not.be.null;
                //Send a message
                const receiver = helper.getNode("receiver");
                receiver.should.not.be.null;
                receiver.on("input", function (msg) {
                    try {
                        console.log("Message received", msg);
                        msg.should.have.property('topic');
                        msg.should.have.property('messageId');
                        msg.should.have.property('publishTime');
                        msg.should.have.property('eventTime');
                        msg.should.have.property('redeliveryCount');
                        msg.should.have.property('partitionKey');
                        msg.should.have.property('properties');

                        msg.should.have.property('payload');
                        msg.payload.should.have.property('name');
                        msg.payload.name.should.be.equal(name);
                        msg.payload.should.have.property('age');
                        msg.payload.age.should.be.equal(age);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });

                sendMsg(pulsarPort, topic, message, done);
            } catch (err) {
                done(err);
            }
        });
    });

    it('Producer should send a message to consumer',  function (done) {
        const flow = [
            {id: "producer", type: "pulsar-producer", config: "config", schema: "schema",topic: topic, subscription: consumerSubscription, wires: [["status"]] },
            {id: "consumer", type: "pulsar-consumer", config: "config", topic: topic, name: producerName, wires: [["receiver"], []] },
            {id: "config", type: "pulsar-config", serviceUrl: "pulsar://localhost:" + pulsarPort },
            { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
            {id: "status", type: "helper"},
            {id: "receiver", type: "helper"}
        ];
        helper.load([pulsarConfigNode,pulsarSchemaNode, pulsarProducerNode, pulsarConsumerNode], flow, function () {
            try {
                const name = "test"+Math.random();
                const age = Math.floor(Math.random() * 100);
                const message = {
                    name: name,
                    age: age
                };
                const testValue = "test"+Math.random();
                const producer = helper.getNode("producer");
                //Node should be loaded
                producer.should.not.be.null;
                //Wait for status message and send a message
                const status = helper.getNode("status");
                status.on("input", function (msg) {
                    try {
                        console.log("Producer status received", msg);
                        msg.should.have.property('payload');
                        msg.payload.should.have.property('type');
                        msg.payload.type.should.be.equal('producer');
                        msg.payload.should.have.property('status');
                        msg.payload.status.should.be.equal('ready');
                        producer.receive({payload: message});
                    } catch (err) {
                        done(err);
                    }
                });
                //Receive the message
                const receiver = helper.getNode("receiver");
                receiver.should.not.be.null;
                receiver.on("input", function (msg) {
                    try {
                        console.log("Message received", msg);
                        msg.should.have.property('payload');
                        msg.payload.should.have.property('name');
                        msg.payload.name.should.be.equal(name);
                        msg.payload.should.have.property('age');
                        msg.payload.age.should.be.equal(age);
                        done();
                    } catch (err) {
                        done(err);
                    }
                });
            } catch (err) {
                done(err);
            }
        });
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
            producer.close();
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
