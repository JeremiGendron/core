'use strict'

module.exports = class VirtualMachine {
  /**
   * Create a new VirtualMachine instance.
   */
  constructor () {
    this.vm = {}
  }


  /**
   * Retrieve given key off the VirtualMachine instance
   */
  get (key) {
    if (!this.has(key)) {
      throw new Error(`${key} doesn't exist in storage`)
    }
    return this.vm[key]
  }
}
