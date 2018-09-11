'use strict'

const container = require('@arkecosystem/core-container')
const logger = container.resolvePlugin('logger')
const emitter = container.resolvePlugin('emitter')
const crypto = require('crypto')
const { __opList } = require('./defaults')
const { verifyIntegrity } = require('./utils')

module.exports = class VirtualMachine {
  /**
   * Create a new VirtualMachine instance.
   */
  constructor (opList) {
    this.vm = {
      opList: opList
    }
  }

  /**
   * Start the VirtualMachine with __opList if opList not provided via
   * the constructor(). Prompt the user to verify the integrity of the opList
   * before proceeding to __setUp().
   */
  async start () {
    if (!this.vm.opList) {
      this.vm.opList = __opList
    }

    const integral = await this.verifyIntegrity(
//      this.vm.opList, logger.info, logger.warn, logger.error,
      console.log,`${this.__opListHashes()}`
    )

    switch (integral) {
      case 0:
        logger.error(`opList was deemed invalid`)
        this.emit('opList.status', 0)
        return false
      break;
      case 1:
        logger.info(`opList was deemed valid`)
        this.emit('opList.status', 1)
        return this.__setUp()
      break;
      case 2:
        logger.warn(`opList validity couldn't be asserted`)
        this.emit('opList.status', 0)
        return false
    }
  }

  /**
   * Convert the opList into opCode: function pairs.
   */
  async __setUp () {
    this.vm.id = this.__hash(this.__opListHashes)
    this.vm.stack = []
    this.vm.events = []
    this.vm.solution = null

    for (op of this.vm.opList) {
      this.vm.opCodes[op] = this.vm.opList[op]
    }
  }


  /**
   * Convert the opList into hashed output to facilitate opList validation.
   */
  __opListHashes() {
    let result = {}
    let sum = ""

    for (op of this.vm.opList) {
      let top = this.__hash(op)
      let bot = this.__hash(this.vm.opList[op])

      result[op] = {
        prop: this.vm.opList[op],
        hash: top + bot
      }

      sum += top + bot
    }

    return `opListHashes\n ${result} \n sum: ${this.__hash(sum)}`
  }

  /**
   * Retrieve given key from the VirtualMachine instance
   */
  get (key) {
    if (!this.has(key)) {
      throw new Error(`${key} doesn't exist in vm instance ${this.vm.id}`)
    }

    return this.vm[key]
  }

  /**
   * @param opCode: 0xOPCODE0xIDHASH
   * @param params: {Void[]}
   */
  async call (opCode, params) {
    this.vm.call = { opCode, params }
    this.emit('vm.call', `${this.vm.call}`)

    try {
      let op = opCode.split('0x')[1]

      if (this.vm.opCodes.hasOwnProperty(op)) {
        this.vm.solution = await this.vm.opCodes[op](params, this.call)

      } else throw new Error({message: `opCode ${opCode} undefined`, code: 0x404})
    } catch (e) {

      logger.error(`couldn't finish ${this.vm.call}\n Error: ${e.message}\n Code: ${e.code} `)
      this.emit('vm.error', `${this.vm.call}`)

    }
  }

  async execute (opCode) {
    await this.call(opCode)

    this.emit('vm.events', `${this.vm.events}`)
    this.emit('vm.stack', `${this.vm.stack}`)
    this.emit('vm.solution', `${this.vm.solution}`)

    this.clearEvents()
    this.clearStack()
    this.clearSolution()
  }

  clearEvents () {
    this.vm.events = []
  }

  clearStack () {
    this.vm.stack = []
  }

  clearEvents () {
    this.vm.solution = null
  }

  emit (event, payload) {
    emitter.emit(event, payload)
  }

  on (event, func) {
    emitter.on(event, func)
  }

  __hash (input) {
    return crypto.createHash('sha256').update(input).digest().toString('hex')
  }
}
