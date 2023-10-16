
interface IDeviceAccuracy {
  calculateDeviceAccuracy(measurements: number[], reference: number): string
}

export default IDeviceAccuracy