import IDeviceAccuracy from "./IDeviceAccuracy";

enum AccuracyProps {
  accepted = 'accepted',
  discarded = 'discarded'
}

const getAccuracy = (elements: number[], reference: number): AccuracyProps => {
  const acceptedVariation = reference * 0.01
  let evaluation = AccuracyProps.accepted
  
  elements.some(value => {
    if (value < (reference - acceptedVariation) || value > (reference + acceptedVariation)) {
      evaluation = AccuracyProps.discarded
      return true
    }
    return false
  })

  return evaluation
}

class HumidityAccuracy implements IDeviceAccuracy {
  
  calculateDeviceAccuracy(measurements: number[], reference: number): string {
    if (!Array.isArray(measurements) || measurements.length < 2) {
      return 'Please, provide a valid set of values!'
    }

    return getAccuracy(measurements, reference)
  }
}

export default HumidityAccuracy