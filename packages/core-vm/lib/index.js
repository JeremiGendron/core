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

    return new VirtualMachine(options)
  }
}

/**
 * Expose utilities important to other modules
 * @type {Function}
 */
exports.utils = require('./utils')
