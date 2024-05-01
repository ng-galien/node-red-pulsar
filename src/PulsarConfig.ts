import {PulsarConsumerConfig} from "./PulsarDefinition";
import {
    ConsumerConfig,
    ConsumerCryptoFailureAction,
    InitialPosition,
    RegexSubscriptionMode,
    SubscriptionType
} from "pulsar-client";

const { v4: uuidv4 } = require('uuid');

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
export function parseNonEmptyString(value?: string): string | undefined {
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
    if (value && value !== '') {
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
    if (value && value !== '') {
        return value as T
    }
    throw new Error('Missing mandatory enum value')
}

/**
 * Parses the user input value and checks if it is a valid choice from the given options.
 *
 * @param {string[]} choices - An array of valid choices.
 * @param {string} [value] - The user input value to be checked against the choices.
 * @return {string|undefined} - The valid choice if the user input matches any of the choices, otherwise undefined.
 */
export function parseChoice<T extends string>(choices: T[], value?: string): T | undefined {
    if (value && choices.includes(value as T)) {
        return value as T
    }
    return undefined
}

/**
 * Parses a mandatory choice from a list of choices based on a value.
 * If the value matches one of the choices, it will be returned.
 * Otherwise, an error will be thrown indicating a missing mandatory choice value.
 *
 * @param {T[]} choices - The list of choices to choose from.
 * @param {string} [value] - The value to match against the choices.
 *
 * @throws {Error} - If the value does not match any of the choices, an error will be thrown.
 *
 * @returns {T} - The matching choice value.
 */
export function parseMandatoryChoice<T extends string>(choices: T[], value?: string): T {
    if (value && choices.includes(value as T)) {
        return value as T
    }
    throw new Error('Missing mandatory choice value')
}

/**
 * Represents a Pulsar topic.
 *
 * @interface
 * @property {string} [single] - Represents a single Pulsar topic.
 * @property {string[]} [list] - Represents a list of Pulsar topics.
 * @property {string} [pattern] - Represents a pattern for Pulsar topics.
 */
interface PulsarTopic {
    single?: string;
    list?: string[];
    pattern?: string;
}


/**
 * Parses a topic string and returns an object representing the topic structure.
 * The topic string can be a single topic, a list of topics separated by ';', or a pattern with '*'.
 * If the topic string is unidentified or empty, an error is thrown.
 *
 * @param {string} topic - The topic string to parse.
 * @throws {Error} - If the topic string is unidentified or empty.
 * @returns {PulsarTopic} - The parsed topic object.
 */
export function parseTopic(topic: string): PulsarTopic {
    //If the topic is unidentified or empty, throw an error
    if (!topic || topic === '') {
        throw new Error('Missing mandatory topic value')
    }
    //If the topic is a string with ; try to split it into an array
    if (topic.includes(';')) {
        const topics = topic.split(';')
            .map(t => t.trim())
            .filter(t => t !== '')
        if(topics.length === 0){
            throw new Error('Missing mandatory topic value')
        }
        return {list: topics}
    }
    //If the topic is a string with * it is a pattern
    if (topic.includes('*')) {
        return {pattern: topic.trim()}
    }
    //Otherwise it is a single topic
    return {single: topic.trim()}
}

export function consumerConfig(config: PulsarConsumerConfig): ConsumerConfig {
    const topic = parseTopic(config.topic)
    return {
        topic: topic.single,
        topics: topic.list,
        topicsPattern: topic.pattern,
        subscription: config.subscription || 'consumer-' + uuidv4(),
        subscriptionType: parseMandatoryChoice<SubscriptionType>(['Exclusive', 'Shared', 'KeyShared', 'Failover'], config.subscriptionType),
        subscriptionInitialPosition: parseChoice<InitialPosition>(['Latest', 'Earliest'], config.subscriptionInitialPosition),
        ackTimeoutMs: parseNumber(config.ackTimeoutMs),
        nAckRedeliverTimeoutMs: parseNumber(config.nAckRedeliverTimeoutMs),
        receiverQueueSize: parseNumber(config.receiverQueueSize),
        receiverQueueSizeAcrossPartitions: parseNumber(config.receiverQueueSizeAcrossPartitions),
        consumerName: config.consumerName || 'consumer-' + uuidv4(),
        properties: undefined,
        readCompacted: parseBoolean(config.readCompacted),
        privateKeyPath: parseNonEmptyString(config.privateKeyPath),
        cryptoFailureAction: parseChoice<ConsumerCryptoFailureAction>(['FAIL', 'DISCARD', 'CONSUME'], config.cryptoFailureAction),
        maxPendingChunkedMessage: parseNumber(config.maxPendingChunkedMessage),
        autoAckOldestChunkedMessageOnQueueFull: parseNumber(config.autoAckOldestChunkedMessageOnQueueFull),
        batchIndexAckEnabled: parseBoolean(config.batchIndexAckEnabled),
        regexSubscriptionMode: parseChoice<RegexSubscriptionMode>(['PersistentOnly', 'NonPersistentOnly', "AllTopics"], config.regexSubscriptionMode),
        deadLetterPolicy: undefined,
        batchReceivePolicy: undefined
    }
}
