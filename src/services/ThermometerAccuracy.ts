import { getMean, getStandardDeviation } from "../utilities/math";
import IDeviceAccuracy from "./IDeviceAccuracy";

enum Accuracy {
  ultra_precise = 'ultra precise',
  very_precise = 'very precise',
  precise = 'precise'
}

const getAccuracy = (mean: number, standardDeviation: number, reference: number): string => {
  if (mean < (reference - 0.5) || mean > (reference + 0.5)) {
    return Accuracy.precise
  } else {
    if (standardDeviation < 3) {
      return Accuracy.ultra_precise
    }

    if (standardDeviation < 5) {
      return Accuracy.very_precise
    }

    return Accuracy.precise
  }
}

class ThermometerAccuracy implements IDeviceAccuracy {

  calculateDeviceAccuracy(measurements: number[], reference: number): string {  
    if (!Array.isArray(measurements) || measurements.length < 2) {
      return 'Please, provide a valid set of values!'
    }

    const mean = getMean(measurements)
    const standardDeviation = getStandardDeviation(measurements)
    const accuracy = getAccuracy(mean, standardDeviation, reference)
  
    return accuracy
  }
}

export default ThermometerAccuracy