'use strict'

const x;

module.exports = class VirtualMachine {
  /**
   * Create a new VirtualMachine instance.
   */
  constructor () {
    this.vm = {}
  }

  get (key) {
    if (!this.has(key)) {
      throw new Error(`${key} doesn't exist in storage`)
    }
    return this.vm[key]
  }
}
