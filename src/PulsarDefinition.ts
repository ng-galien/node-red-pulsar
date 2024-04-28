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

export interface TypedField {
    name: string
    type: EditorWidgetTypedInputType,
    value?: string
}

export const PulsarClientId = "pulsar-client"
export const PulsarAuthenticationId = "pulsar-authentication"
export const PulsarSchemaId = "pulsar-schema"
export const PulsarConsumerId = "pulsar-consumer"
export const PulsarProducerId = "pulsar-producer"

export function parseNumber(value?: string): number | undefined {
    const num = Number(value)
    return isNaN(num) ? undefined : num
}

export function parseBoolean(value?: string): boolean | undefined {
    if (value === 'true') {
        return true
    }
    if (value === 'false') {
        return false
    }
    return undefined
}

export function parseString(value?: string): string | undefined {
    if (value) {
        return value === '' ? undefined : value
    }
    return undefined
}

export function parseEnum<T extends string>(value?: string): T | undefined {
    if (value) {
        return value as T
    }
    return undefined
}
