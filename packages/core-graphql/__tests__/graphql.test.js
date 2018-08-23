const app = require('./__support__/setup')

let graphql
let logger

<<<<<<< Updated upstream
const { testQueries,
        testData,
        testExpected,
        testHistory
=======
const { testData,
        testQueries,
        testExpected
>>>>>>> Stashed changes
      } = require('./__fixtures__')

let references = {
  data: {
    blocks: [],
    transactions: [],
    wallets: []
  },
  queries: {},
  expected: {}
}

beforeAll(async () => {
  const container = await app.setUp()
  graphql = await container.resolvePlugin('graphql')
  logger = await container.resolvePlugin('logger')
  logger.info('Starting GraphQL Tests!')
})

afterAll(() => {
  app.tearDown()
})

describe('GraphQL', () => {
  it('should be an object', () => {
    expect(graphql).toBeObject()
  })

  describe('test data', () => {
    it('should be an object', () => {
      expect(testData).toBeObject()
    })

    describe('loading blocks', () => {
      references.data.blocks = testData.blocks
      expect(references.data.blocks).toBe(testData.blocks)

      it('should load transactions', () => {
        for(let i = 0; i < testData.transactions.length; i++){
          let transaction = testData.transactions[i]
          let blockIndex = references.data.blocks.findIndex(block => block.id == transaction.block)

          references.data.blocks[blockIndex].transactions.push(transaction)

          logger.info(`Block with id ${references.data.blocks[i].id} now has transaction with id ${testData.transactions[i].id}`)
        }
      })

      it('should now have transactions', () => {
        expect(testData.transactions).toEqual(expect.arrayContaining(references.data.blocks[0].transactions))
      })
    })
  })

  describe('test queries', () => {
    it('should be an object', () => {
      expect(testQueries).toBeObject()
    })
  })
  describe('test expected', () => {
    it('should be an object', () => {
      expect(testExpected).toBeObject()
    })
  })

  describe('test history', () => {
    xit('should be an object', () => { //empty json for the moment, will change
      expect(testHistory).toBeObject()
    })
  })
})
