const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    // CODE HERE
    const testArr = ['a','b','c',1,2,3]
    test('array lengths should be the same', () => {
        expect(testArr.length).toBe(shuffleArray(testArr).length)
    })
    test('testArr should not be equal to the shuffled array', () => {
        expect(testArr).not.toBe(shuffleArray(testArr))
    })
    test('shuffleArray should return an array', () => {
        expect(typeof shuffleArray(testArr)).toBe(typeof testArr)
    })
})