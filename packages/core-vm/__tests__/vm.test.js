const container = require('@arkecosystem/core-container')
const VmClass = require('../lib/virtual-machine')
const { __opList } = require('../lib/defaults')
const { opListTest } = require('./__fixtures__')

let VirtualMachineDefault = new VmClass()
let VirtualMachineCustom = new VmClass(opListTest)

beforeAll(async () => {
  console.log(container)
  // VirtualMachine = await container.resolvePlugin('vm')
})

describe('Virtual Machine Default', async () => {
  it('should be an object', () => {
    expect(VirtualMachineDefault).toBeObject()
  })
  it('should be instance of vmClass', () => {
    expect(VirtualMachineDefault).toBeInstanceOf(VmClass)
  })
  it('should have no opList', () => {
    expect(VirtualMachineDefault.vm.opList).toBe(undefined)
  })
  it('should start', () => {
    VirtualMachineDefault.start()
    expect(VirtualMachineDefault.vm.opList).toEqual(__opList)
  })
})

describe('Virtual Machine Custom', async () => {
  it('should be an object', () => {
    expect(VirtualMachineCustom).toBeObject()
  })
  it('should be instance of vmClass', () => {
    expect(VirtualMachineCustom).toBeInstanceOf(VmClass)
  })
  it('should have an opList', () => {
    console.log(Object.keys(VirtualMachineCustom))
    expect(VirtualMachineCustom.vm.opList).toBe(opListTest)
  })
  it('should start', () => {
    VirtualMachineCustom.start()
    expect(VirtualMachineCustom.vm.opList).not.toEqual(__opList)
  })
})
