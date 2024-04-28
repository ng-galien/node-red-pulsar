import * as NodeRED from 'node-red'
import * as EditorClient from '@node-red/editor-client'
import {
    AuthenticationOauth2,
    AuthenticationTls,
    AuthenticationToken,
    SchemaType
} from 'pulsar-client'


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
    subscriptionType?: string
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
    properties?: Record<string, string>
    publicKeyPath?: string
    encryptionKey?: string
    cryptoFailureAction?: string
    chunkingEnabled?: string
    accessMode?: string
}

export interface PulsarProducerConfig extends PulsarProducerProperties, NodeRED.NodeDef {}

export interface PulsarProducerEditorConfig extends PulsarProducerProperties, EditorClient.NodeProperties {}

//Reader
export interface PulsarReaderProperties {
    clientNodeId: string
    schemaNodeId: string
    topic: string
    receiverQueueSize?: string
    readerName?: string
    subscriptionRolePrefix?: string
    readCompacted?: string
    privateKeyPath?: string
    cryptoFailureAction?: string
}

export interface PulsarReaderConfig extends PulsarReaderProperties, NodeRED.NodeDef {}

export interface PulsarReaderEditorConfig extends PulsarReaderProperties, EditorClient.NodeProperties {}

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
export const PulsarClientId = "pulsar-client"

/**
 * The identifier for the Pulsar authentication.
 */
export const PulsarAuthenticationId = "pulsar-authentication"

/**
 * The identifier for the Pulsar schema.
 */
export const PulsarSchemaId = "pulsar-schema"

/**
 * The identifier for the Pulsar consumer.
 */
export const PulsarConsumerId = "pulsar-consumer"

/**
 * The identifier for the Pulsar producer.
 */
export const PulsarProducerId = "pulsar-producer"

/**
 * The identifier for the Pulsar reader.
 */
export const PulsarReaderId = "pulsar-reader"

/**
 * Parses a string representation of a number into a number.
 *
 * @param {string} value - The string representation of the number to parse.
 * @return {number | undefined} - The parsed number or undefined if the input value is not a valid number.
 */
export function parseNumber(value?: string): number | undefined {
    const num = Number(value)
    return isNaN(num) ? undefined : num
}


/**
 * Parses a string value to a boolean. Returns `true` if the value is 'true', `false` if the value is 'false', or `undefined` if the value is neither 'true' nor 'false'.
 *
 * @param {string} value - The string value to parse.
 * @return {boolean|undefined} - The parsed boolean value. Returns `true` if the value is 'true', `false` if the value is 'false', or `undefined` if the value is neither 'true' nor 'false'.
 */
export function parseBoolean(value?: string): boolean | undefined {
    if (value === 'true') {
        return true
    }
    if (value === 'false') {
        return false
    }
    return undefined
}


/**
 * Parses a string value and returns the value if it is not empty, otherwise returns undefined.
 *
 * @param {string} value - The string value to be parsed.
 *
 * @return {string | undefined} - The parsed string value. If value is not empty, returns the value. Otherwise, returns undefined.
 */
export function parseString(value?: string): string | undefined {
    if (value) {
        return value === '' ? undefined : value
    }
    return undefined
}

/**
 * Parses a string value and returns the value if it is not empty, otherwise throws an error.
 *
 * @param {string} value - The string value to be parsed.
 *
 * @return {string} - The parsed string value. If value is not empty, returns the value. Otherwise, throws an error.
 */
export function parseEnum<T extends string>(value?: string): T | undefined {
    if (value) {
        return value as T
    }
    return undefined
}

/**
 * Parses a string value and returns the value if it is not empty, otherwise throws an error.
 *
 * @param {string} value - The string value to be parsed.
 *
 * @return {string} - The parsed string value. If value is not empty, returns the value. Otherwise, throws an error.
 */
export function parseMandatoryEnum<T extends string>(value?: string): T {
    if (value) {
        return value as T
    }
    throw new Error('Missing mandatory enum value')
}
