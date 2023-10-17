import { LogProps, ReadingProps } from "../types";
import HumidityAccuracy from "./HumidityAccuracy";
import IDeviceAccuracy from "./IDeviceAccuracy";
import MonoxideAccuracy from "./MonoxideAccuracy";
import SensorAccuracy from "./SensorAccuracy";
import ThermometerAccuracy from "./ThermometerAccuracy";

function prepareLogObject(log: string[]): LogProps {
  const referenceLine = log[0].split(" ");
  const measurementLines = log.slice(1);

  const reference = {
    temperature: referenceLine[1],
    humidity: referenceLine[2],
    monoxide: referenceLine[3],
  };

  const readings: LogProps | object = { reference, readings: {} };

  let deviceName: string = "";
  let measurementName: string = "";

  measurementLines.reduce((data, value) => {
    const reading = value.split(" ");
    if (
      value.indexOf("temperature") != -1 ||
      value.indexOf("humidity") != -1 ||
      value.indexOf("monoxide") != -1
    ) {
      measurementName = reading[0];
      deviceName = reading[1];
    } else {
      const measurementData: ReadingProps = {
        device: deviceName,
        timestamp: reading[0],
        value: Number(reading[1]),
      };

      data["readings"][measurementName]
        ? data["readings"][measurementName].push(measurementData)
        : (data["readings"][measurementName] = [measurementData]);
    }

    return data;
  }, readings);

  // console.log(readings)
  return readings;
}

export const parse = async (logfile: File) => {
  type MeasurementDeviceProps = {
    [key: string]: number[];
  };

  function splitDevicesByName(
    devices: ReadingProps[],
    measurement: ReadingProps
  ): MeasurementDeviceProps[] {
    devices[measurement.device] = devices[measurement.device] || [];
    devices[measurement.device].push(measurement.value);

    return devices;
  }

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      const content = fileReader.result;
      const lines = content.split("\n");

      const logObject = prepareLogObject(lines);

      const temperatureDevices: MeasurementDeviceProps[] =
        logObject.readings.temperature.reduce(splitDevicesByName, {});
      const humidityDevices: MeasurementDeviceProps[] =
        logObject.readings.humidity.reduce(splitDevicesByName, {});
      const monoxideDevices: MeasurementDeviceProps[] =
        logObject.readings.monoxide.reduce(splitDevicesByName, {});

      const thermometer = new ThermometerAccuracy();
      const humidity = new HumidityAccuracy();
      const monoxide = new MonoxideAccuracy();
      const deviceEvalutations = {};

      function getDeviceAccuracy(
        deviceArray: MeasurementDeviceProps[],
        AbstractEntity: IDeviceAccuracy,
        measurementType: string
      ) {
        Object.entries(deviceArray).forEach((device) => {
          const sensorAccuracy = new SensorAccuracy(
            AbstractEntity
          ).calculateAccuracy(device[1], logObject.reference[measurementType]);
          deviceEvalutations[measurementType] =
            deviceEvalutations[measurementType] || [];
          deviceEvalutations[measurementType].push({
            device: device[0],
            accuracy: sensorAccuracy,
          });
        });
      }

      getDeviceAccuracy(temperatureDevices, thermometer, "temperature");
      getDeviceAccuracy(humidityDevices, humidity, "humidity");
      getDeviceAccuracy(monoxideDevices, monoxide, "monoxide");

      resolve(deviceEvalutations);
    };

    fileReader.readAsText(logfile);
  });
};
