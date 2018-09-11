const container = require('@arkecosystem/core-container')
const vmClass = require('../lib/virtual-machine')
const { __opList } = require('../lib/defaults')

let VirtualMachineDefault = new vmClass()
let VirtualMachineCustom = new vmClass()

beforeAll(async () => {
  //VirtualMachine = await container.resolvePlugin('vm')
})

describe('Virtual Machine Default', async () => {
  it('should be an object', () => {
    expect(VirtualMachineDefault).toBeObject()
  })
  it('should be instance of vmClass', () => {
    expect(VirtualMachineDefault).toBeInstanceOf(vmClass)
  })
  it('should have no opList', () => {
    expect(VirtualMachineDefault.opList).toBe(undefined)
  })
  it('should start', () => {
    VirtualMachineDefault.start()
    expect(VirtualMachineDefault.vm.opList).toEqual(__opList)
  })
})
