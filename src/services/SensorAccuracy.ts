import IDeviceAccuracy from "./IDeviceAccuracy";

class SensorAccuracy {
  DeviceAccuracy: IDeviceAccuracy

  constructor(DeviceAccuracy: IDeviceAccuracy) {
    this.DeviceAccuracy = DeviceAccuracy
  }

  calculateAccuracy(readings: number[], reference: number): string {
    const accuracy = this.DeviceAccuracy.calculateDeviceAccuracy(readings, reference)
    
    return accuracy
  }

  
}

export default SensorAccuracy