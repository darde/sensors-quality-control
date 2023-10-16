import IDeviceAccuracy from "./IDeviceAccuracy";

enum AccuracyProps {
  accepted = 'accepted',
  discarded = 'discarded'
}

const getAccuracy = (elements: number[], reference: number): AccuracyProps => {
  const acceptedVariation = 3
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

class MonoxideAccuracy implements IDeviceAccuracy {
  calculateDeviceAccuracy(measurements: number[], reference: number): string {
    if (!Array.isArray(measurements) || measurements.length < 2) {
      return 'Please, provide a valid set of values!'
    }

    return getAccuracy(measurements, reference)
  }
}

export default MonoxideAccuracy