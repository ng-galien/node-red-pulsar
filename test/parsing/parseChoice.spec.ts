import {expect} from 'chai'
import {parseChoice} from '../../src/PulsarConfig'

type choiceType = 'choice1' | 'choice2' | 'choice3' | 'choice4'


describe('parseChoice', () => {
    it('Should return choice if value is in the choices array', () => {
        const choices: choiceType[] = ['choice1', 'choice2', 'choice3']
        const value: choiceType = 'choice2'
        const result = parseChoice(choices, value)
        expect(result).to.equal(value)
    })

    it('Should return undefined if value is not in the choices array', () => {
        const choices: choiceType[] = ['choice1', 'choice2', 'choice3']
        const value: choiceType = 'choice4'
        const result = parseChoice(choices, value)
        expect(result).to.equal(undefined)
    })

    it('Should return undefined if value is not provided', () => {
        const choices: choiceType[] = ['choice1', 'choice2', 'choice3']
        const result = parseChoice(choices)
        expect(result).to.equal(undefined)
    })

    it('Should return undefined if choices array is empty', () => {
        const choices: choiceType[] = []
        const value: choiceType = 'choice2'
        const result = parseChoice(choices, value)
        expect(result).to.equal(undefined)
    })

})

