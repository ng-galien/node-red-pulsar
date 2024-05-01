import { parseMandatoryEnum } from '../../src/PulsarConfig'
import { expect } from 'chai'
import 'mocha'

describe('parseMandatoryEnum', () => {

    it('should return the correct value when a permitted value is provided', () => {
        const permittedValue = 'PERMITTED_VALUE'
        const result = parseMandatoryEnum(permittedValue)
        expect(result).to.equal(permittedValue)
    })

    it('should throw an error when an empty string is provided', () => {
        const emptyString = ''
        expect(() => parseMandatoryEnum(emptyString)).to.throw('Missing mandatory enum value')
    })

    it('should throw an error when no argument is provided', () => {
        expect(() => parseMandatoryEnum()).to.throw('Missing mandatory enum value')
    })
})
