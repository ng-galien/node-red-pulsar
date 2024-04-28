import * as NodeRED from 'node-red'
import * as EditorClient from '@node-red/editor-client'
import {
    AuthenticationOauth2,
    AuthenticationTls,
    AuthenticationToken, ClientConfig, ConsumerConfig, ProducerConfig,
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
export interface PulsarClientProperties extends ClientConfig {
    authenticationNodeId: string
}
export interface PulsarClientEditorConfig extends PulsarClientProperties, EditorClient.NodeProperties {}

export interface PulsarClientConfig extends PulsarClientProperties, NodeRED.NodeDef { }

//Schema
export interface SchemaProperties {
    schemaType: SchemaType
    schemaName?: string
    schema?: string
    properties?: Record<string, string>
}

export interface PulsarSchemaConfig extends SchemaProperties, NodeRED.NodeDef {
}

export interface PulsarSchemaEditorConfig extends SchemaProperties, EditorClient.NodeProperties {
}

export interface PulsarConsumerProperties extends ConsumerConfig {
    clientNodeId: string
    schemaNodeId: string
}

export interface PulsarConsumerConfig extends PulsarConsumerProperties, NodeRED.NodeDef {}

export interface PulsarConsumerEditorConfig extends PulsarConsumerProperties, EditorClient.NodeProperties {}

export interface PulsarProducerProperties extends ProducerConfig {
    clientNodeId: string
    schemaNodeId: string
}

export interface PulsarProducerConfig extends PulsarProducerProperties, NodeRED.NodeDef {}

export interface PulsarProducerEditorConfig extends PulsarProducerProperties, EditorClient.NodeProperties {}

export interface TypedField {
    name: string
    type: EditorWidgetTypedInputType
}

export const PulsarClientId = "pulsar-client"
export const PulsarAuthenticationId = "pulsar-authentication"
export const PulsarSchemaId = "pulsar-schema"
export const PulsarConsumerId = "pulsar-consumer"
export const PulsarProducerId = "pulsar-producer"
