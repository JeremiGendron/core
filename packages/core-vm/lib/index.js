'use strict'

const VirtualMachine = require('./virtual-machine');

/**
 * The struct used by the plugin container.
 * @type {VirtualMachine}
 */
exports.plugin = {
  pkg: require('../package.json'),
  defaults: require('./defaults'),
  alias: 'vm',
  async register (container, options) {
    container.resolvePluggin('logger').info('Instantiating Virtual Machine')

    const machine = new VirtualMachine(options.opList)

    if (!process.env.ARK_SKIP_VM) {
      await machine.start()
    }

    return machine
  },
  async deregister (container, options) {
    await container.resolvePlugin('vm').stop()
  }
}

/**
 * Expose utilities important to other modules
 * @type {Function}
 */
exports.utils = require('./utils')
