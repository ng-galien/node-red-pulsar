// @ts-ignore
import helper, { TestFlowsItem } from 'node-red-node-test-helper';
import pulsarClientNode from '../../src/client/pulsar-client';
import pulsarAuthenticationNode from '../../src/authentication/pulsar-authentication';
import pulsarSchemaNode from '../../src/schema/pulsar-schema';
import pulsarProducerNode from '../../src/producer/pulsar-producer';
import pulsarConsumerNode from '../../src/consumer/pulsar-consumer';
import pulsarReaderNode from '../../src/reader/pulsar-reader';
import Pulsar, { AuthenticationToken, Client, SchemaInfo } from 'pulsar-client';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
// @ts-ignore
import {
  AuthenticationImpl,
  PulsarAuthenticationConfig,
  PulsarAuthenticationId,
  PulsarClientConfig,
  PulsarClientId,
  PulsarConsumerConfig,
  PulsarConsumerId,
  PulsarProducerConfig,
  PulsarProducerId,
  PulsarReaderConfig,
  PulsarReaderId,
  PulsarSchemaConfig,
  PulsarSchemaId,
} from '../../src/PulsarDefinition';
import { Node } from 'node-red';
import { v4 } from 'uuid';
import { Logger } from 'tslog';
import axios from 'axios';
import { expect } from 'chai';

const logger = new Logger();

const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';

describe('Pulsar Integration Test', function () {
  const topic = 'it-' + v4();
  let container: StartedTestContainer;

  before(async function () {
    logger.info('Before');
    this.timeout(60000);
    container = await createPulsarContainer();
    return createTopic(container, topic);
  });

  beforeEach(function (done) {
    logger.info('BeforeEach');
    helper.startServer(done);
  });

  afterEach(function (done) {
    logger.info('AfterEach');
    helper.unload().then(function () {
      helper.stopServer(done);
    });
  });

  after(async function () {
    logger.info('After');
    await stopPulsarContainer(container);
    return new Promise<void>((resolve) => {
      helper.stopServer(resolve);
    });
  });

  it('Authentication should be loaded', async function () {
    await helper.load([pulsarAuthenticationNode], [authenticationConf()]);
    const node = helper.getNode('authentication') as Node<AuthenticationImpl>;
    node.should.not.be.null;
    const auth: AuthenticationImpl = node.credentials;
    auth.should.not.be.null;
    expect(auth).to.be.an.instanceOf(AuthenticationToken);
    const expectedAuth: AuthenticationToken = new AuthenticationToken({
      token: jwtToken,
    });
    expect(expectedAuth).to.be.eql(auth);
  });

  it('Schema should be loaded', async function () {
    await helper.load([pulsarSchemaNode], [schemaConf()]);
    const node = helper.getNode('schema') as Node<Pulsar.SchemaInfo>;
    node.should.not.be.null;
    const schema: SchemaInfo = node.credentials;
    schema.should.not.be.null;
    const expectedSchema: SchemaInfo = {
      name: 'sample',
      schemaType: 'Json',
      schema: JSON.stringify(jsonSchema),
      properties: undefined,
    };
    expect(expectedSchema).to.be.eql(schema);
  });

  it('Client should initialize', async function () {
    await helper.load([pulsarClientNode], [clientConf(container)]);
    const node = helper.getNode('client') as Node<Client>;
    node.should.not.be.null;
    const client: Client = node.credentials;
    client.should.not.be.null;
    client.should.be.an.instanceOf(Pulsar.Client);
    logger.info('Client loaded');
  });

  it('Client with credential should initialize', async function () {
    await helper.load(
      [pulsarClientNode, pulsarAuthenticationNode],
      [clientConf(container), authenticationConf()],
    );
    const node = helper.getNode('client') as Node<Client>;
    node.should.not.be.null;
    const client: Client = node.credentials;
    client.should.not.be.null;
    client.should.be.an.instanceOf(Pulsar.Client);
    logger.info('Client loaded');
  });

  it('Producer should be loaded', async function () {
    const producerName = 'test-producer-' + v4();
    const flow = [
      clientConf(container),
      schemaConf(),
      producerConf(topic, producerName),
      statusConf(),
    ];
    await helper.load(
      [pulsarClientNode, pulsarSchemaNode, pulsarProducerNode],
      flow,
    );
    const status = helper.getNode('status');
    status.should.not.be.null;
    const expected = {
      type: 'producer',
      status: 'ready',
      topic: topic,
      producerName: producerName,
    };
    await expectPayload('status', expected);
  });

  it('Consumer should be loaded', async function () {
    const subscriptionName = 'test-' + v4();
    const flow = [
      clientConf(container),
      schemaConf(),
      consumerConf(topic, subscriptionName),
      statusConf(),
      receiverConf(),
    ];
    await helper.load(
      [pulsarClientNode, pulsarSchemaNode, pulsarConsumerNode],
      flow,
    );
    const expected = {
      type: 'consumer',
      status: 'ready',
      topic: topic,
      subscription: subscriptionName,
      subscriptionType: 'Shared',
    };
    await expectPayload('status', expected);
  });

  it('Reader should be loaded', async function () {
    const flow = [
      clientConf(container),
      schemaConf(),
      readerConf(topic),
      statusConf(),
      receiverConf(),
    ];
    await helper.load(
      [pulsarClientNode, pulsarSchemaNode, pulsarReaderNode],
      flow,
    );
    const expected = {
      type: 'reader',
      status: 'ready',
      topic: topic,
    };
    await expectPayload('status', expected);
  });

  it('Consumer should receive a message', async function () {
    const subscriptionName = 'test-' + v4();
    const flow = [
      clientConf(container),
      schemaConf(),
      consumerConf(topic, subscriptionName),
      receiverConf(),
    ];
    await helper.load(
      [pulsarClientNode, pulsarSchemaNode, pulsarConsumerNode],
      flow,
    );
    const name = 'test' + Math.random();
    const age = Math.floor(Math.random() * 100);
    const message = {
      name: name,
      age: age,
    };
    await sendMsgToBroker(container, topic, message);
    await expectPayload('receiver', message);
  });

  it('Reader should receive a message', async function () {
    const flow = [
      clientConf(container),
      schemaConf(),
      readerConf(topic),
      receiverConf(),
    ];
    await helper.load(
      [pulsarClientNode, pulsarSchemaNode, pulsarReaderNode],
      flow,
    );
    const name = 'test' + Math.random();
    const age = Math.floor(Math.random() * 100);
    const message = {
      name: name,
      age: age,
    };
    await sendMsgToBroker(container, topic, message);
    await expectPayload('receiver', message);
  });

  it('Producer should send a message to consumer', async function () {
    const producerName = 'test-producer-' + v4();
    const subscriptionName = 'test-' + v4();
    const flow = [
      clientConf(container),
      schemaConf(),
      producerConf(topic, producerName),
      consumerConf(topic, subscriptionName),
      statusConf(),
      receiverConf(),
    ];
    await helper.load(
      [
        pulsarClientNode,
        pulsarSchemaNode,
        pulsarProducerNode,
        pulsarConsumerNode,
      ],
      flow,
    );
    const name = 'test' + Math.random();
    const age = Math.floor(Math.random() * 100);
    const message = {
      name: name,
      age: age,
    };
    const producer = helper.getNode('producer');
    producer.should.not.be.null;
    const status = helper.getNode('status');
    status.should.not.be.null;
    status.on('input', function () {
      producer.receive({ payload: message });
    });
    await expectPayload('receiver', message);
  });
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function createPulsarContainer() {
  logger.info('Starting pulsar container');
  return new GenericContainer('apachepulsar/pulsar')
    .withCommand(['bin/pulsar', 'standalone'])
    .withExposedPorts(6650, 8080)
    .withWaitStrategy(Wait.forHttp('/admin/v2/persistent/public/default', 8080))
    .start();
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function stopPulsarContainer(container: StartedTestContainer) {
  console.log('Stopping pulsar container');
  return container.stop();
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function createTopic(broker: StartedTestContainer, topic: string) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  return axios.put(
    brokerApiUrl(broker) + '/admin/v2/persistent/public/default/' + topic,
    {},
    config,
  );
}

const jsonSchema = {
  type: 'record',
  name: 'Test',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'age', type: 'int' },
  ],
};

helper.init(require.resolve('node-red'));

function clientConf(
  broker: StartedTestContainer,
): TestFlowsItem<PulsarClientConfig> {
  return {
    id: 'client',
    type: PulsarClientId,
    serviceUrl: brokerUrl(broker),
    authenticationNodeId: 'authentication',
  };
}

function authenticationConf(): TestFlowsItem<PulsarAuthenticationConfig> {
  return {
    id: 'authentication',
    type: PulsarAuthenticationId,
    authType: 'Token',
    jwtToken: jwtToken,
  };
}

function schemaConf(): TestFlowsItem<PulsarSchemaConfig> {
  return {
    id: 'schema',
    type: PulsarSchemaId,
    schemaName: 'sample',
    schemaType: 'Json',
    schema: JSON.stringify(jsonSchema),
  };
}

function statusConf() {
  return {
    id: 'status',
    type: 'helper',
  };
}

function receiverConf() {
  return {
    id: 'receiver',
    type: 'helper',
  };
}

function consumerConf(
  topic: string,
  sub: string,
): TestFlowsItem<PulsarConsumerConfig> {
  return {
    id: 'consumer',
    type: PulsarConsumerId,
    clientNodeId: 'client',
    schemaNodeId: 'schema',
    topic: topic,
    subscriptionType: 'Shared',
    subscription: sub,
    wires: [['receiver'], ['status']],
  };
}

function readerConf(topic: string): TestFlowsItem<PulsarReaderConfig> {
  return {
    id: 'reader',
    type: PulsarReaderId,
    clientNodeId: 'client',
    schemaNodeId: 'schema',
    topic: topic,
    startMessage: 'Latest',
    wires: [['receiver'], ['status']],
  };
}

function producerConf(
  topic: string,
  producerName: string,
): TestFlowsItem<PulsarProducerConfig> {
  return {
    id: 'producer',
    type: PulsarProducerId,
    clientNodeId: 'client',
    schemaNodeId: 'schema',
    topic: topic,
    producerName: producerName,
    wires: [['status']],
  };
}

function expectPayload(node: string, payload: {}) {
  const n = helper.getNode(node);
  n.should.not.be.null;
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout: No message received'));
    }, 1000); // 5 seconds timeout

    try {
      n.on('input', function (msg) {
        clearTimeout(timeout);
        try {
          logger.debug('Message received', msg);
          expect(msg.payload).to.be.eql(payload);
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
}

async function sendMsgToBroker(
  broker: StartedTestContainer,
  topic: string,
  message: any,
) {
  const client = new Pulsar.Client({
    serviceUrl: brokerUrl(broker),
    operationTimeoutSeconds: 30,
  });
  const producer = await client.createProducer({
    topic: topic,
    producerName: 'test-producer' + v4(),
  });
  await producer.send({
    data: Buffer.from(JSON.stringify(message)),
    eventTimestamp: Date.now(),
  });
  await producer.close();
  await client.close();
}

function brokerUrl(broker: StartedTestContainer) {
  return 'pulsar://localhost:' + broker.getMappedPort(6650);
}

function brokerApiUrl(broker: StartedTestContainer) {
  return 'http://localhost:' + broker.getMappedPort(8080);
}
