import helper, {TestFlowsItem} from "node-red-node-test-helper";
// @ts-ignore
import pulsarConsumerNode from "../../src/consumer/pulsar-consumer";
// @ts-ignore
import pulsarProducerNode from "../../src/producer/pulsar-producer";
// @ts-ignore
import pulsarClientNode from "../../src/client/pulsar-client";
import pulsarSchemaNode from "../../src/schema/pulsar-schema";
// @ts-ignore
import Pulsar, {Client, SchemaInfo} from 'pulsar-client';
import {GenericContainer, StartedTestContainer, Wait} from "testcontainers";
// @ts-ignore
import {
    PulsarClientConfig,
    PulsarClientId, PulsarConsumerConfig,
    PulsarSchemaConfig,
    PulsarSchemaId
} from "../../src/PulsarDefinition";
import {Node} from "node-red";
import { v4 } from 'uuid';
import {Logger} from "tslog";
import axios from "axios";

const logger = new Logger();

async function createPulsarContainer() {
    logger.info("Starting pulsar container")
    return new GenericContainer("apachepulsar/pulsar")
        .withCommand(["bin/pulsar", "standalone"])
        .withExposedPorts(6650, 8080)
        .withWaitStrategy(Wait.forHttp("/admin/v2/persistent/public/default", 8080))
        .start()
}

async function stopPulsarContainer(container: StartedTestContainer) {
    console.log("Stopping pulsar container")
    return container.stop()
}

async function createTopic(brokerUrl: String, topic: string) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return axios.put(brokerUrl + '/admin/v2/persistent/public/default/' + topic, {}, config)
}


// @ts-ignore
const jsonSchema = {
    type: "record",
    name: "Test",
    fields: [
        {name: "name", type: "string"},
        {name: "age", type: "int"}
    ]
};

helper.init(require.resolve('node-red'));

let container: StartedTestContainer;
// @ts-ignore
function clientConf(): TestFlowsItem<PulsarClientConfig> {
    return {
        id: "client",
        type: PulsarClientId,
        serviceUrl: "pulsar://localhost:" + container.getMappedPort(6650)
    }
}

function schemaConf(): TestFlowsItem<PulsarSchemaConfig> {
    return {
        id: "schema",
        type: PulsarSchemaId,
        schemaName: "sample",
        schemaType: "Json",
        schema: JSON.stringify(jsonSchema)
    }
}

describe('Pulsar Consumer/Producer', function () {

    const topic = "tests-" + v4();

    before(async function () {
        logger.info('Before')
        this.timeout(60000);
        const pulsar = await createPulsarContainer();
        container = pulsar;
        const brokerUrl = "http://localhost:" + pulsar.getMappedPort(8080);
        return createTopic(brokerUrl, topic);
    });

    afterEach(function(done) {
        logger.info('AfterEach')
        helper.unload().then(function() {
            done();
        });
    });

    after( async function () {
        logger.info('After')
        await stopPulsarContainer(container)
        return new Promise<void>((resolve) => {
            helper.stopServer(resolve);
        })
    });

    it('Schema should be loaded',  async function () {
        await helper.load([pulsarSchemaNode], [schemaConf()]);
        const node = helper.getNode("schema") as Node<Pulsar.SchemaInfo>;
        node.should.not.be.null;
        const schema: SchemaInfo = node.credentials;
        schema.should.not.be.null;
        const expectedSchema: SchemaInfo = {
            name: "sample",
            schemaType: "Json",
            schema: JSON.stringify(jsonSchema)
        }
        // @ts-ignore
        schema.name.should.be.equal(expectedSchema.name);
        schema.schemaType.should.be.equal(expectedSchema.schemaType);
        // @ts-ignore
        schema.schema.should.be.equal(expectedSchema.schema);
        logger.info("Schema loaded")
    })

    it('Client should initialize',  async function () {
        await helper.load([pulsarClientNode], [clientConf()]);
        const node = helper.getNode("client") as Node<Client>;
        node.should.not.be.null;
        const client: Client = node.credentials;
        client.should.not.be.null;
        client.should.be.an.instanceOf(Pulsar.Client);
        logger.info("Client loaded")
    });

    it('Consumer should be loaded',  async function () {
        const subscriptionName = "test-" + v4();
        const consumerConf: TestFlowsItem<PulsarConsumerConfig> = {
            id: "consumer",
            type: "pulsar-consumer",
            clientNodeId: "client",
            schemaNodeId: "schema",
            topic: topic,
            subscriptionType: "Shared",
            subscription: subscriptionName,
            wires: [[], ["status"]]
        }
        const flow = [
            clientConf(), schemaConf(), consumerConf, { id: "status", type: "helper" }
        ];
        await helper.load([pulsarClientNode, pulsarSchemaNode, pulsarConsumerNode], flow);
        const status = helper.getNode("status");
        status.should.not.be.null;
        const test = new Promise<void>((resolve, reject) => {
            const status = helper.getNode("status");
            try {
                status.on("input", function (msg) {
                    try {
                        logger.info("Message received", msg);
                        msg.should.have.property('topic');
                        // @ts-ignore
                        msg.topic.should.be.equal('pulsar');
                        msg.should.have.property('payload');
                        // @ts-ignore
                        msg.payload.should.have.property('type');
                        // @ts-ignore
                        msg.payload.type.should.be.equal('consumer');
                        // @ts-ignore
                        msg.payload.should.have.property('status');
                        // @ts-ignore
                        msg.payload.status.should.be.equal('ready');
                        // @ts-ignore
                        msg.payload.should.have.property('topic');
                        // @ts-ignore
                        msg.payload.topic.should.be.equal(topic);
                        // @ts-ignore
                        msg.payload.should.have.property('subscription');
                        // @ts-ignore
                        msg.payload.subscription.should.be.equal(subscriptionName);
                        logger.info("Consumer loaded")
                        resolve();
                    } catch (err) {
                        logger.error(err);
                        reject(err);
                    }
                });
            } catch (err) {
                logger.error(err);
                reject(err);
            }
        });
        await test;
    });

    // it('Producer should be loaded',  function (done) {
    //     const producer: TestFlowsItem<PulsarProducerConfig> = {
    //         id: "producer",
    //         type: "pulsar-producer",
    //         clientNodeId: "client",
    //         schemaNodeId: "schema",
    //         topic: topic,
    //         producerName: producerName,
    //         wires: [["status"]]
    //     }
    //     const flow = [
    //         clientConf(pulsarPort), schemaConf(),
    //         producer, { id: "status", type: "helper" }
    //     ];
    //     helper.load([pulsarClientNode, pulsarSchemaNode, pulsarProducerNode], flow, function () {
    //         try {
    //             //Wait for status message
    //             const status = helper.getNode("status");
    //             status.on("input", function (msg) {
    //                 try {
    //                     //console.log("Message received", msg);
    //                     msg.should.have.property('topic');
    //                     // msg.topic.should.be.equal('pulsar');
    //                     // msg.should.have.property('payload');
    //                     // msg.payload.should.have.property('type');
    //                     // msg.payload.type.should.be.equal('producer');
    //                     // msg.payload.should.have.property('status');
    //                     // msg.payload.status.should.be.equal('ready');
    //                     // msg.payload.should.have.property('topic');
    //                     // msg.payload.topic.should.be.equal(topic);
    //                     // msg.payload.should.have.property('producerName');
    //                     // msg.payload.producerName.should.be.equal(producerName);
    //                     done();
    //                 } catch (err) {
    //                     done(err);
    //                 }
    //             });
    //         } catch (err) {
    //             done(err);
    //         }
    //     });
    // });
    //
    // it('Consumer should receive a message',  function (done) {
    //     const flow = [
    //         { id: "consumer", type: "pulsar-consumer", config: "config", topic: topic, schema: "schema", subscription: consumerSubscription, wires: [["receiver"]] },
    //         { id: "config", type: "pulsar-client", serviceUrl: "pulsar://localhost:" + pulsarPort },
    //         { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
    //         { id: "receiver", type: "helper"}
    //     ];
    //     helper.load([pulsarClientNode, pulsarSchemaNode, pulsarConsumerNode], flow, function () {
    //         try {
    //             const name = "test"+Math.random();
    //             const age = Math.floor(Math.random() * 100);
    //             const message = {
    //                 name: name,
    //                 age: age
    //             };
    //             const consumer = helper.getNode("consumer");
    //             //Node should be loaded
    //             consumer.should.not.be.null;
    //             //Send a message
    //             const receiver = helper.getNode("receiver");
    //             receiver.should.not.be.null;
    //             receiver.on("input", function (msg) {
    //                 try {
    //                     //console.log("Message received", msg);
    //                     msg.should.have.property('topic');
    //                     msg.should.have.property('messageId');
    //                     msg.should.have.property('publishTime');
    //                     msg.should.have.property('eventTime');
    //                     msg.should.have.property('redeliveryCount');
    //                     msg.should.have.property('partitionKey');
    //                     msg.should.have.property('properties');
    //
    //                     msg.should.have.property('payload');
    //                     // msg.payload.should.have.property('name');
    //                     // msg.payload.name.should.be.equal(name);
    //                     // msg.payload.should.have.property('age');
    //                     // msg.payload.age.should.be.equal(age);
    //                     done();
    //                 } catch (err) {
    //                     done(err);
    //                 }
    //             });
    //
    //             sendMsg(pulsarPort, topic, message, done);
    //         } catch (err) {
    //             done(err);
    //         }
    //     });
    // });
    //
    // it('Producer should send a message to consumer',  function (done) {
    //     const flow = [
    //         {id: "producer", type: "pulsar-producer", config: "config", schema: "schema",topic: topic, subscription: consumerSubscription, wires: [["status"]] },
    //         {id: "consumer", type: "pulsar-consumer", config: "config", topic: topic, name: producerName, wires: [["receiver"], []] },
    //         {id: "config", type: "pulsar-client", serviceUrl: "pulsar://localhost:" + pulsarPort },
    //         { id: "schema", type: "pulsar-schema", schemaType: "Json", schema: JSON.stringify(jsonSchema) },
    //         {id: "status", type: "helper"},
    //         {id: "receiver", type: "helper"}
    //     ];
    //     helper.load([pulsarClientNode,pulsarSchemaNode, pulsarProducerNode, pulsarConsumerNode], flow, function () {
    //         try {
    //             const name = "test"+Math.random();
    //             const age = Math.floor(Math.random() * 100);
    //             const message = {
    //                 name: name,
    //                 age: age
    //             };
    //             //const testValue = "tests"+Math.random();
    //             const producer = helper.getNode("producer");
    //             //Node should be loaded
    //             producer.should.not.be.null;
    //             //Wait for status message and send a message
    //             const status = helper.getNode("status");
    //             status.on("input", function () {
    //                 try {
    //                     //console.log("Producer status received", msg);
    //                     // msg.should.have.property('payload');
    //                     // msg.payload.should.have.property('type');
    //                     // msg.payload.type.should.be.equal('producer');
    //                     // msg.payload.should.have.property('status');
    //                     // msg.payload.status.should.be.equal('ready');
    //                     producer.receive({payload: message});
    //                 } catch (err) {
    //                     done(err);
    //                 }
    //             });
    //             //Receive the message
    //             const receiver = helper.getNode("receiver");
    //             receiver.should.not.be.null;
    //             receiver.on("input", function (msg) {
    //                 try {
    //                     //console.log("Message received", msg);
    //                     msg.should.have.property('payload');
    //                     // msg.payload.should.have.property('name');
    //                     // msg.payload.name.should.be.equal(name);
    //                     // msg.payload.should.have.property('age');
    //                     // msg.payload.age.should.be.equal(age);
    //                     done();
    //                 } catch (err) {
    //                     done(err);
    //                 }
    //             });
    //         } catch (err) {
    //             done(err);
    //         }
    //     });
    // });
});


// @ts-ignore
function sendMsg(port: number, topic: string, message: { name: string; age: number; }, done: { (err?: string): void; (arg0: any): void; }) {
    const serviceUrl = "pulsar://localhost:" + port;
    const client = new Pulsar.Client({
        serviceUrl: serviceUrl,
        operationTimeoutSeconds: 30
    });
    client.createProducer({
        topic: topic
    }).then(producer => {
        //console.log("Producer created");
        producer.send({
            data: Buffer.from(JSON.stringify(message))
        }).then(() => {
            producer.close();
            client.close();
        }).catch(e => {
            done(e);
        });
    }).catch(e => {
        client.close();
        done(e);
    });
}
