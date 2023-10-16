import { LogProps, ReadingProps } from "../types"
import HumidityAccuracy from "./HumidityAccuracy"
import MonoxideAccuracy from "./MonoxideAccuracy"
import SensorAccuracy from "./SensorAccuracy"
import ThermometerAccuracy from "./ThermometerAccuracy"


// type LogProp = {
//   reference: {
//     temperature: number,
//     humidity: number,
//     monoxide: number
//   }
// }

function prepareLogObject(log: string[]): LogProps {
  
  const referenceLine = log[0].split(' ')
  const measurementLines = log.slice(1)
  
  const reference = {
    temperature: referenceLine[1],
    humidity: referenceLine[2],
    monoxide: referenceLine[3]
  }

  const readings: LogProps | object = { reference, readings: {}}

  let deviceName: string = ''
  let measurementName: string = ''

  measurementLines.reduce((data, value) => {
    const reading = value.split(' ')
    if (value.indexOf('temperature') != -1 || value.indexOf('humidity') != -1 || value.indexOf('monoxide') != -1) {
      measurementName = reading[0]
      deviceName = reading[1]
    } else {
      const measurementData: ReadingProps = {
        device: deviceName,
        timestamp: reading[0],
        value: Number(reading[1]),
      }
      
      data['readings'][measurementName]
        ? data['readings'][measurementName].push(measurementData)
        : data['readings'][measurementName] = [measurementData]
    }

    return data
  }, readings)

  // console.log(readings)
  return readings
}

export const parse = async (logfile: File) => {
  type DeviceResultProps = {
    device: string,
    measurement: number
  }

  type ResultProps = {
    temperatureDevices: DeviceResultProps[],
    humidityDevices: DeviceResultProps[],
    monoxideDevices: DeviceResultProps[],
  }

  const results: ResultProps = {
    temperatureDevices: [],
    humidityDevices: [],
    monoxideDevices: []
  }

  type MeasurementDeviceProps  = {
    [key: string]: number[]
  }
  function splitDevicesByName(devices: ReadingProps[], measurement: ReadingProps): MeasurementDeviceProps[] {
    devices[measurement.device] = devices[measurement.device] || []
    devices[measurement.device].push(measurement.value)

    return devices
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {                 
      const content = fileReader.result;
      const lines = content.split('\n')
      
      const logObject = prepareLogObject(lines)
      
      const temperatureDevices: MeasurementDeviceProps[] = logObject.readings.temperature.reduce(splitDevicesByName, {})
      const humidityDevices: MeasurementDeviceProps[] = logObject.readings.humidity.reduce(splitDevicesByName, {})
      const monoxideDevices: MeasurementDeviceProps[] = logObject.readings.monoxide.reduce(splitDevicesByName, {})
      
      const thermometer = new ThermometerAccuracy()
      const humidity = new HumidityAccuracy()
      const monoxide = new MonoxideAccuracy()
      
      const temperatureDevicesAccuracy = []
      Object.entries(temperatureDevices).forEach(device => {
        const thermoAccuracy = new SensorAccuracy(thermometer)
          .calculateAccuracy(device[1], logObject.reference.temperature)
        temperatureDevicesAccuracy.push({ device: device[0], accuracy: thermoAccuracy})
      })

      const humidityDevicesAccuracy = []
      Object.entries(humidityDevices).forEach(device => {
        const humidityAccuracy = new SensorAccuracy(humidity)
          .calculateAccuracy(device[1], logObject.reference.humidity)
        humidityDevicesAccuracy.push({ device: device[0], accuracy: humidityAccuracy})
      })

      const monoxideDevicesAccuracy = []
      Object.entries(monoxideDevices).forEach(device => {
        const monoxideAccuracy = new SensorAccuracy(monoxide)
          .calculateAccuracy(device[1], logObject.reference.monoxide)
        monoxideDevicesAccuracy.push({ device: device[0], accuracy: monoxideAccuracy})
      })

      const deviceEvalutations = {
        temperature: [...temperatureDevicesAccuracy],
        humidity: [...humidityDevicesAccuracy],
        monoxide: [...monoxideDevicesAccuracy]
      }
    
      resolve(deviceEvalutations)
    }
  
    fileReader.readAsText(logfile);
  })
}