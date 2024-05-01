// Import required modules from Mocha and Chai
import { expect } from 'chai'
import { describe, it } from 'mocha'

// Import the function parseEnum from PulsarConfig
import { parseEnum } from '../../src/PulsarConfig'

// Define an enum for testing
enum TestEnum {
    Value1 = 'Value1',
    Value2 = 'Value2',
    Value3 = 'Value3',
}

// Write the test suite for parseEnum
describe('parseEnum', () => {
    it('should return the input string when it is not empty and a valid enum member', () => {
        const result = parseEnum<TestEnum>('Value1')
        expect(result).to.equal(TestEnum.Value1)
        const result2 = parseEnum<TestEnum>('Value2')
        expect(result2).to.equal(TestEnum.Value2)
        const result3 = parseEnum<TestEnum>('Value3')
        expect(result3).to.equal(TestEnum.Value3)
    })

    it('should return undefined when the input string is empty', () => {
        const result = parseEnum<TestEnum>('')
        expect(result).to.be.undefined
    })

    it('should return undefined when no input is provided', () => {
        const result = parseEnum<TestEnum>()
        expect(result).to.be.undefined
    })
})
