const bip38 = require('bip38')

const generateTransactions = require('@arkecosystem/core-test-utils/lib/generators/transactions/transfer')
const genesisBlock = require('@arkecosystem/core-test-utils/config/testnet/genesisBlock')
const { Delegate, Block } = require('@arkecosystem/crypto').models
const { keys } = require('@arkecosystem/crypto').identities
const { TESTNET } = require('@arkecosystem/crypto').constants.CONFIGURATIONS.ARK

const passphrase = 'this is a top secret passphrase'
const password = '123'
const previousBlock = {
  id: '17882607875259085966',
  version: 0,
  timestamp: 46583330,
  height: 2,
  reward: '0',
  previousBlock: '17184958558311101492',
  numberOfTransactions: 0,
  totalAmount: '0',
  totalFee: '0',
  payloadLength: 0,
  payloadHash:
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  generatorPublicKey:
    '026c598170201caf0357f202ff14f365a3b09322071e347873869f58d776bfc565',
  blockSignature:
    '3045022100e7385c6ea42bd950f7f6ab8c8619cf2f66a41d8f8f185b0bc99af032cb25f30d02200b6210176a6cedfdcbe483167fd91c21d740e0e4011d24d679c601fdd46b0de9',
  createdAt: '2018-09-11T16:48:50.550Z',
}

describe('Delegate Model - Crypto', () => {
  describe('Instantiation scenarios', () => {
    it('Should throw when creating an empty Delegate', () => {
      expect(() => {
        const delegate = new Delegate()
      }).toThrow()
    })

    it('Should fail when providing passphrase without network', () => {
      expect(() => {
        const delegate = new Delegate(passphrase)
      }).toThrow()
    })

    it('Should create a new Delegate when provided a passphrase and network', () => {
      const delegate = new Delegate(passphrase, TESTNET)
      expect(delegate.keys).toHaveProperty('privateKey')
      expect(delegate.network).toHaveProperty('name', 'testnet')
    })
  })

  describe('BIP38 Encryption with password', () => {
    let encryptedPassphrase
    let decryptedKeys
    let delegate

    it('Should return a valid encrypted passphrase', () => {
      encryptedPassphrase = Delegate.encryptPassphrase(
        passphrase,
        TESTNET,
        password,
      )

      expect(bip38.verify(encryptedPassphrase)).toBe(true)
    })

    it('Should decrypt into the original passphrase', () => {
      decryptedKeys = Delegate.decryptPassphrase(
        encryptedPassphrase,
        TESTNET,
        password,
      )

      expect(keys.fromPassphrase(passphrase).privateKey).toBe(
        decryptedKeys.privateKey,
      )
    })

    it('Should create a delegate with the encrypted passphrase, network and password', () => {
      delegate = new Delegate(encryptedPassphrase, TESTNET, password)

      expect(delegate.keys).toBe(null)
      expect(delegate).toHaveProperty('encryptedKeys')
      expect(delegate.network).toHaveProperty('name', 'testnet')
    })

    it('Should decrypt into keys using encryptedKeys and otp', () => {
      delegate.decryptKeysWithOtp()

      expect(decryptedKeys).toEqual(delegate.keys)
    })

    it('Should catch missing arguments and set keys to null', () => {
      const localDelegate = new Delegate(encryptedPassphrase)

      expect(localDelegate.address).toBe(null)
      expect(localDelegate.publicKey).toBe(null)
      expect(localDelegate.keys).toBe(null)
    })
  })

  describe('Forge', () => {
    const delegate = new Delegate(passphrase, TESTNET)

    it('Should return false when supplying a version > 0', () => {
      expect(delegate.forge([], { version: 1 })).toBe(false)
    })

    it('Should forge an array of transactions', () => {
      const transactions = generateTransactions()
      const block = delegate.forge(transactions, {
        previousBlock,
        timestamp: 47583330,
      })

      expect(block.transactions.length).toEqual(transactions.length)
      expect(block.verification.verified).toBe(true)
    })
  })
})
