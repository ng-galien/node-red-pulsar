# node-red-contrib-pulsar

Add producer and consumer nodes to your Node-RED flow to send and receive messages from Apache Pulsar.

> At the moment it authentication is not supported, working on it.

## Install

> Run the following command in your Node-RED user directory - typically `~/.node-red`

```bash
npm i @ng-galien/node-red-pulsar
```

## Usage

To use the Pulsar nodes in your Node-RED flow, you need to first configure the connection settings.

1. Drag and drop the "Pulsar Config" node onto your flow.
2. Double-click on the node to open the configuration dialog.
3. Enter the Pulsar broker URL, authentication credentials (if required), and other settings.
4. Click "Done" to save the configuration.

Once the connection is configured, you can use the "Pulsar Producer" and "Pulsar Consumer" nodes to send and receive
messages from Apache Pulsar.

### Pulsar Producer

The "Pulsar Producer" node allows you to send messages to a Pulsar topic.

1. Drag and drop the "Pulsar Producer" node onto your flow.
2. Double-click on the node to open the configuration dialog.
3. Select the configured Pulsar connection from the dropdown list.
4. Enter the topic name and the message payload.
5. Click "Done" to save the configuration.

### Pulsar Consumer

The "Pulsar Consumer" node allows you to receive messages from a Pulsar topic.

1. Drag and drop the "Pulsar Consumer" node onto your flow.
2. Double-click on the node to open the configuration dialog.
3. Select the configured Pulsar connection from the dropdown list.
4. Enter the topic name.
5. Click "Done" to save the configuration.

That's it! You can now use the Pulsar nodes in your Node-RED flow to send and receive messages from Apache Pulsar.
