import * as chai from 'chai';
import { schemaConfig } from '../../src/PulsarConfig';
import { PulsarSchemaConfig } from '../../src/PulsarDefinition';
import { SchemaInfo } from 'pulsar-client';

const expect = chai.expect;

describe('PulsarConfig', () => {
    describe('schemaConfig function', () => {
        it('should return correct SchemaInfo according to provided PulsarSchemaConfig', () => {
            const config: PulsarSchemaConfig = {
                z: '',
                id: 'testId',
                type: 'pulsar-schema',
                name: 'testName',
                schema: 'testSchema',
                schemaType: 'String',
                properties: '{"testKey": "testValue"}',
            };

            const result: SchemaInfo = schemaConfig(config);

            // Assert that input has been correctly transformed to output
            expect(result).to.deep.equals({
                name: 'testName',
                schema: undefined,
                schemaType: 'String',
                properties: { testKey: 'testValue' },
            });
        });
    });
});
