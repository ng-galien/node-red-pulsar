# node-red-pulsar

Add Apache Pulsar support to Node-RED.

This package provides a set of nodes that allow you to send and receive messages from Apache Pulsar in your Node-RED flow.

## Features

- **Pulsar Producer**: Send messages to a Pulsar topic.
- **Pulsar Consumer**: Receive messages from a Pulsar topic.
- **Pulsar Reader**: Read messages from a Pulsar topic.

These nodes use some configuration nodes:

- **Pulsar Client**: Configure the connection settings for the Pulsar client.
- **Pulsar Authentication**: Configure the authentication settings for the Pulsar client.
- **Pulsar Schema**: Configure the schema settings for producing and consuming messages.

![img.png](assets/all-nodes.png)

These nodes are based on the [Pulsar Node.js client](https://github.com/apache/pulsar-client-node).

## Install

> Run the following command in your Node-RED user directory - typically `~/.node-red`

```bash
npm i @ng-galien/node-red-pulsar
```

## Example Flow

A [sample](examples/pulsar-nodes.json) flow is provided in the `example` directory. You can import it into your Node-RED instance.

At first a standalone Pulsar instance is required.

```bash
docker run -it -p 6650:6650  -p 8080:8080 apachepulsar/pulsar bin/pulsar standalone
```

![img.png](assets/sample.png)

```json
[
  {
    "id": "cfa24f481be37bf9",
    "type": "tab",
    "label": "Pulsar Nodes Sample",
    "disabled": false,
    "info": "",
    "env": []
  },
  {
    "id": "16849d1efa765e73",
    "type": "pulsar-client",
    "name": "Pulsar Standalone",
    "authenticationNodeId": "",
    "serviceUrl": "pulsar://localhost:6650",
    "operationTimeoutSeconds": "30",
    "ioThreads": "1",
    "messageListenerThreads": "1",
    "concurrentLookupRequest": "50000",
    "useTls": "false",
    "tlsTrustCertsFilePath": "",
    "tlsValidateHostname": "false",
    "tlsAllowInsecureConnection": "false",
    "statsIntervalInSeconds": "60",
    "listenerName": ""
  },
  {
    "id": "3ee18b73e42befd6",
    "type": "pulsar-schema",
    "schemaName": "City",
    "schemaType": "Json",
    "schema": "{\"type\":\"record\",\"name\":\"city\",\"fields\":[{\"name\":\"Name\",\"type\":\"string\"},{\"name\":\"population\",\"type\":\"int\"}]}",
    "properties": "{}"
  },
  {
    "id": "27adf10af4f74286",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "Timestamp",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "",
    "payloadType": "date",
    "x": 120,
    "y": 100,
    "wires": [["c13687c96840c562"]]
  },
  {
    "id": "5a53caeafb829a6d",
    "type": "debug",
    "z": "cfa24f481be37bf9",
    "name": "Consumer Out",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "true",
    "targetType": "full",
    "statusVal": "",
    "statusType": "auto",
    "x": 540,
    "y": 280,
    "wires": []
  },
  {
    "id": "f655d018737c735a",
    "type": "debug",
    "z": "cfa24f481be37bf9",
    "name": "Consumer Status",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "statusVal": "",
    "statusType": "auto",
    "x": 550,
    "y": 320,
    "wires": []
  },
  {
    "id": "7735035db371684c",
    "type": "debug",
    "z": "cfa24f481be37bf9",
    "name": "Producer Status",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "statusVal": "",
    "statusType": "auto",
    "x": 540,
    "y": 140,
    "wires": []
  },
  {
    "id": "85bb6379ed87dd9a",
    "type": "debug",
    "z": "cfa24f481be37bf9",
    "name": "Reader Out",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "statusVal": "",
    "statusType": "auto",
    "x": 530,
    "y": 420,
    "wires": []
  },
  {
    "id": "952e560bfeb6ae25",
    "type": "debug",
    "z": "cfa24f481be37bf9",
    "name": "Reader Status",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "statusVal": "",
    "statusType": "auto",
    "x": 540,
    "y": 480,
    "wires": []
  },
  {
    "id": "3281b4f57695c320",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "seek",
    "payload": "Earliest",
    "payloadType": "str",
    "x": 130,
    "y": 380,
    "wires": [["89ea0f494da5b4fa"]]
  },
  {
    "id": "4b01b0659c75f7b4",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "seek",
    "payload": "Latest",
    "payloadType": "str",
    "x": 130,
    "y": 440,
    "wires": [["89ea0f494da5b4fa"]]
  },
  {
    "id": "5ab4db75e76b7795",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "seek",
    "payload": "10000",
    "payloadType": "num",
    "x": 130,
    "y": 500,
    "wires": [["89ea0f494da5b4fa"]]
  },
  {
    "id": "4a22a010210a7f94",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "Test",
    "payloadType": "str",
    "x": 110,
    "y": 140,
    "wires": [["c13687c96840c562"]]
  },
  {
    "id": "7188c9b4615d1ca0",
    "type": "inject",
    "z": "cfa24f481be37bf9",
    "name": "Json",
    "props": [{ "p": "payload" }, { "p": "topic", "vt": "str" }],
    "repeat": "",
    "crontab": "",
    "once": false,
    "onceDelay": 0.1,
    "topic": "",
    "payload": "{\"name\":\"Foncine-le-Bas\",\"population\":198}",
    "payloadType": "json",
    "x": 110,
    "y": 200,
    "wires": [["c13687c96840c562"]]
  },
  {
    "id": "5574625e10bc9d3e",
    "type": "pulsar-consumer",
    "z": "cfa24f481be37bf9",
    "name": "Consumer",
    "clientNodeId": "16849d1efa765e73",
    "schemaNodeId": "3ee18b73e42befd6",
    "topic": "city",
    "subscription": "test",
    "subscriptionType": "Shared",
    "subscriptionInitialPosition": "Latest",
    "ackTimeoutMs": "10000",
    "nAckRedeliverTimeoutMs": "60000",
    "receiverQueueSize": "100",
    "receiverQueueSizeAcrossPartitions": "1000",
    "consumerName": "",
    "readCompacted": "false",
    "privateKeyPath": "",
    "cryptoFailureAction": "FAIL",
    "maxPendingChunkedMessage": "10",
    "autoAckOldestChunkedMessageOnQueueFull": "10",
    "batchIndexAckEnabled": "false",
    "regexSubscriptionMode": "AllTopics",
    "x": 350,
    "y": 300,
    "wires": [["5a53caeafb829a6d"], ["f655d018737c735a"]]
  },
  {
    "id": "89ea0f494da5b4fa",
    "type": "pulsar-reader",
    "z": "cfa24f481be37bf9",
    "name": "Reader",
    "clientNodeId": "16849d1efa765e73",
    "schemaNodeId": "3ee18b73e42befd6",
    "topic": "city",
    "startMessage": "Latest",
    "receiverQueueSize": "100",
    "readerName": "",
    "readCompacted": "false",
    "subscriptionRolePrefix": "",
    "privateKeyPath": "",
    "cryptoFailureAction": "Default",
    "x": 340,
    "y": 440,
    "wires": [["85bb6379ed87dd9a"], ["952e560bfeb6ae25"]]
  },
  {
    "id": "c13687c96840c562",
    "type": "pulsar-producer",
    "z": "cfa24f481be37bf9",
    "name": "Producer",
    "clientNodeId": "16849d1efa765e73",
    "schemaNodeId": "3ee18b73e42befd6",
    "topic": "city",
    "producerName": "",
    "sendTimeoutMs": "",
    "initialSequenceId": "",
    "maxPendingMessages": "",
    "maxPendingMessagesAcrossPartitions": "",
    "blockIfQueueFull": "true",
    "messageRoutingMode": "Default",
    "hashingScheme": "Default",
    "compressionType": "Default",
    "batchingEnabled": "true",
    "batchingMaxPublishDelayMs": "",
    "batchingMaxMessages": "",
    "properties": "{}",
    "publicKeyPath": "",
    "encryptionKey": "",
    "cryptoFailureAction": "Default",
    "chunkingEnabled": "false",
    "accessMode": "Default",
    "x": 340,
    "y": 140,
    "wires": [["7735035db371684c"]]
  }
]
```
