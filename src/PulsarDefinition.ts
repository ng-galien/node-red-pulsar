import * as NodeRED from 'node-red'
import {NodeMessage} from 'node-red'
import * as EditorClient from '@node-red/editor-client'
import {AuthenticationOauth2, AuthenticationTls, AuthenticationToken, Message, SchemaType} from 'pulsar-client'



//Authentication
type PulsarAuthenticationType = 'none' | 'token' | 'oauth2' | 'tls'

interface PulsarAuthenticationProperties {
    authType: PulsarAuthenticationType
    jwtToken?: string
    oauthType?: string
    oauthIssuerUrl?: string
    oauthClientId?: string
    oauthClientSecret?: string
    oauthPrivateKey?: string
    oauthAudience?: string
    oauthScope?: string
    tlsCertificatePath?: string
    tlsPrivateKeyPath?: string
}

export interface PulsarAuthenticationEditorConfig extends PulsarAuthenticationProperties, EditorClient.NodeProperties { }

export interface NoAuthentication { blank: true }

export type AuthenticationImpl = AuthenticationToken | AuthenticationOauth2 | AuthenticationTls | NoAuthentication

export interface PulsarAuthentication extends PulsarAuthenticationProperties, NodeRED.NodeDef { }

//Client
export interface PulsarClientProperties  {
    authenticationNodeId: string
    serviceUrl: string
    operationTimeoutSeconds?: string
    ioThreads?: string
    messageListenerThreads?: string
    concurrentLookupRequest?: string
    useTls?: string
    tlsTrustCertsFilePath?: string
    tlsValidateHostname?: string
    tlsAllowInsecureConnection?: string
    statsIntervalInSeconds?: string
    listenerName?: string
}
export interface PulsarClientEditorConfig extends PulsarClientProperties, EditorClient.NodeProperties {}

export interface PulsarClientConfig extends PulsarClientProperties, NodeRED.NodeDef { }

//Schema
export interface SchemaProperties {
    schemaType: SchemaType
    schemaName?: string
    schema?: string
    properties?: String
}

export interface PulsarSchemaConfig extends SchemaProperties, NodeRED.NodeDef {
}

export interface PulsarSchemaEditorConfig extends SchemaProperties, EditorClient.NodeProperties {
}

//Consumer
export interface PulsarConsumerProperties {
    clientNodeId: string
    schemaNodeId: string
    topic: string
    subscription?: string
    subscriptionType: string
    subscriptionInitialPosition?: string
    ackTimeoutMs?: string
    nAckRedeliverTimeoutMs?: string
    receiverQueueSize?: string
    receiverQueueSizeAcrossPartitions?: string
    consumerName?: string
    properties?: string
    readCompacted?: string
    privateKeyPath?: string
    cryptoFailureAction?: string
    maxPendingChunkedMessage?: string
    autoAckOldestChunkedMessageOnQueueFull?: string
    batchIndexAckEnabled?: string
    regexSubscriptionMode?: string
    deadLetterPolicy?: string
    batchReceivePolicy?: string
}

export interface PulsarConsumerConfig extends PulsarConsumerProperties, NodeRED.NodeDef {}

export interface PulsarConsumerEditorConfig extends PulsarConsumerProperties, EditorClient.NodeProperties {}

//Producer
export interface PulsarProducerProperties {
    clientNodeId: string
    schemaNodeId: string
    topic: string
    producerName?: string
    sendTimeoutMs?: string
    initialSequenceId?: string
    maxPendingMessages?: string
    maxPendingMessagesAcrossPartitions?: string
    blockIfQueueFull?: string
    messageRoutingMode?: string
    hashingScheme?: string
    compressionType?: string
    batchingEnabled?: string
    batchingMaxPublishDelayMs?: string
    batchingMaxMessages?: string
    properties?: String
    publicKeyPath?: string
    encryptionKey?: string
    cryptoFailureAction?: string
    chunkingEnabled?: string
    accessMode?: string
}

export interface PulsarProducerConfig extends PulsarProducerProperties, NodeRED.NodeDef {}

export interface PulsarProducerEditorConfig extends PulsarProducerProperties, EditorClient.NodeProperties {}

//Reader
export type StartMessage = "Earliest" | "Latest"

export interface PulsarReaderProperties {
    clientNodeId: string
    schemaNodeId: string
    topic: string
    startMessage: StartMessage
    receiverQueueSize?: string
    readerName?: string
    subscriptionRolePrefix?: string
    readCompacted?: string
    privateKeyPath?: string
    cryptoFailureAction?: string
}

export interface PulsarReaderConfig extends PulsarReaderProperties, NodeRED.NodeDef {}

export interface PulsarReaderEditorConfig extends PulsarReaderProperties, EditorClient.NodeProperties {}

type EditorWidgetTypedInputType = import("node-red").EditorWidgetTypedInputType
//Editor
export interface TypedField {
    name: string
    type: EditorWidgetTypedInputType,
    value?: string
}

/**
 * The identifier for the Pulsar client.
 *
 * @type {string}
 */
export const PulsarClientId: string = "pulsar-client"

/**
 * The identifier for the Pulsar authentication.
 *
 * @type {string}
 */
export const PulsarAuthenticationId: string = "pulsar-authentication"

/**
 * The identifier for the Pulsar schema.
 *
 * @type {string}
 */
export const PulsarSchemaId: string = "pulsar-schema"

/**
 * The identifier for the Pulsar consumer.
 *
 * @type {string}
 */
export const PulsarConsumerId: string = "pulsar-consumer"

/**
 * The identifier for the Pulsar producer.
 *
 * @type {string}
 */
export const PulsarProducerId: string = "pulsar-producer"

/**
 * The identifier for the Pulsar reader.
 *
 * @type {string}
 */
export const PulsarReaderId: string = "pulsar-reader"


export interface DecodedPulsarMessage extends NodeMessage {
    messageId: string
    publishTimeStamp: number
    eventTimeStamp: number
    redeliveryCount: number
    partitionKey: string
    properties: Record<string, string>
}

export function readPulsarMessage(pulsarMessage: Message): DecodedPulsarMessage {
    const data = pulsarMessage.getData().toString("utf-8")
    let payload: any = data
    try {
        payload = JSON.parse(data)
    } catch (e) {
        // Ignore
    }
    return {
        payload: payload,
        messageId: pulsarMessage.getMessageId().toString(),
        publishTimeStamp: pulsarMessage.getPublishTimestamp(),
        eventTimeStamp: pulsarMessage.getEventTimestamp(),
        redeliveryCount: pulsarMessage.getRedeliveryCount(),
        partitionKey: pulsarMessage.getPartitionKey(),
        properties: pulsarMessage.getProperties()
    }
}
