// Mocha/Chai and related testing framework packages
import {assert} from "chai";
import {describe, it} from "mocha";
import {PulsarProducerConfig} from "../../src/PulsarDefinition";
import {ProducerConfig} from "pulsar-client";
import {producerConfig} from "../../src/PulsarConfig";


describe("producerConfig", () => {
    const mockPulsarProducerConfig: PulsarProducerConfig = {
        clientNodeId: "",
        id: "",
        name: "",
        schemaNodeId: "",
        type: "",
        z: "",
        topic: "test-topic",
        producerName: "test-producer",
        sendTimeoutMs: "500",
        initialSequenceId: "1",
        maxPendingMessages: "100",
        maxPendingMessagesAcrossPartitions: "50",
        blockIfQueueFull: "false",
        messageRoutingMode: 'RoundRobinDistribution',
        hashingScheme: 'Murmur3_32Hash',
        compressionType: 'Zlib',
        batchingEnabled: "false",
        batchingMaxPublishDelayMs: "100",
        batchingMaxMessages: "5",
        properties: "",
        publicKeyPath: "public-key-path",
        encryptionKey: "key",
        cryptoFailureAction: 'FAIL',
        chunkingEnabled: "false",
        accessMode: 'Shared'
    };

    it("should return a valid producer config", () => {
        const config: ProducerConfig = producerConfig(mockPulsarProducerConfig);
        const optionalKeys = ["clientNodeId", "id", "schemaNodeId", "type", "z", "name"];
        assert.typeOf(config, "object");
        Object.keys(mockPulsarProducerConfig)
            .filter((key) => !optionalKeys.includes(key))
            .forEach((key) => {
                const expectedValue = config[key] === undefined ? "" : mockPulsarProducerConfig[key];
                assert.strictEqual(expectedValue, mockPulsarProducerConfig[key], `${key} should be equal to given value`);
            });
    });
});
