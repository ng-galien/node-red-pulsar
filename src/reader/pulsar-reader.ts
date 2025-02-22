import * as NodeRED from 'node-red';
import { Message, Reader, ReaderConfig } from 'pulsar-client';
import { requireClient } from '../PulsarNode';
import {
  PulsarReaderConfig,
  PulsarReaderId,
  readPulsarMessage,
} from '../PulsarDefinition';
import { readerConfig } from '../PulsarConfig';
import { parseSeekPosition, SeekPosition } from '../Seek';

type ReaderNode = NodeRED.Node<Reader>;

/**
 * Creates a ReaderConfig object based on the provided PulsarReaderConfig and ReaderNode.
 *
 * @param {PulsarReaderConfig} config - The PulsarReaderConfig object containing the configuration settings for the reader.
 * @param {ReaderNode} node - The ReaderNode object representing the reader node.
 * @returns {ReaderConfig} - The ReaderConfig object containing the listener function and other configuration settings.
 */
function createConfig(
  config: PulsarReaderConfig,
  node: ReaderNode,
): ReaderConfig {
  const listener = function (message: Message): void {
    node.debug('Received message: ' + JSON.stringify(message));
    const nodeMessage = readPulsarMessage(message);
    node.send([nodeMessage, null]);
  };
  return {
    listener: listener,
    ...readerConfig(node, config),
  };
}

/**
 * Registers the 'pulsar-consumer' type with its configuration.
 */
export = (RED: NodeRED.NodeAPI): void => {
  RED.nodes.registerType(
    PulsarReaderId,
    function (this: ReaderNode, config: PulsarReaderConfig): void {
      RED.nodes.createNode(this, config);
      const client = requireClient(RED, config);
      if (!client) {
        this.error('Client not created');
        return;
      }
      const readerConfig = createConfig(config, this);
      try {
        this.debug('Creating reader: ' + JSON.stringify(readerConfig));
        client
          .createReader(readerConfig)
          .then((reader) => {
            this.credentials = reader;
            this.log('Reader created: ' + JSON.stringify(reader));
            this.status({
              fill: 'green',
              shape: 'dot',
              text: 'connected',
            });
            const message = {
              topic: 'pulsar',
              payload: {
                type: 'reader',
                status: 'ready',
                topic: readerConfig.topic,
              },
            };
            this.send([null, message]);
          })
          .catch((e) => {
            this.error('Error creating reader: ' + e);
            this.status({
              fill: 'red',
              shape: 'dot',
              text: 'Connection error',
            });
          });
      } catch (e) {
        this.error('Error creating reader: ' + e);
        this.status({
          fill: 'red',
          shape: 'dot',
          text: 'Connection error',
        });
      }
      this.on('input', (msg) => {
        if (msg.topic === 'seek') {
          const seekPosition = parseSeekPosition(msg.payload);
          if (seekPosition) {
            seek(this, seekPosition);
          } else {
            this.warn(
              'Invalid seek payload: ' +
                msg.payload +
                ' type: ' +
                typeof msg.payload,
            );
          }
        } else {
          this.error('Invalid input: ' + JSON.stringify(msg));
        }
      });
    },
  );
};

/**
 * Seek to a specific position in the node.
 *
 * @param {ReaderNode} node - The ReaderNode object to seek.
 * @param position
 *                                           object or a number representing the timestamp.
 * @return {void}
 */
function seek(node: ReaderNode, position: SeekPosition): void {
  const reader = node.credentials as Reader;
  const seekingProcess = position.id
    ? reader.seek(position.id)
    : reader.seekTimestamp(position.timestamp);
  seekingProcess
    .then(() => {
      node.log('Seeked to: ' + JSON.stringify(position));
    })
    .catch((e) => {
      node.error('Error seeking: ' + e);
    });
}
