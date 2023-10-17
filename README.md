# Sensors Quality Control

This application simulates a Sensor Quality Control used to measure accuracy on sensors like "Temperature Sensors", "Humidity Sensors", and "Monoxide Sensors".

In order to get the sensors accuracy, the user needs to upload a **sensor log file**. This sensor log file should looks like as the following:

```txt
reference 70.0 45.0 6
temperature temp-1
2007-04-05T22:00 72.4
2007-04-05T22:01 76.0
2007-04-05T22:02 79.1
2007-04-05T22:03 75.6
2007-04-05T22:04 71.2
2007-04-05T22:05 71.4
2007-04-05T22:06 69.2
2007-04-05T22:07 65.2
2007-04-05T22:08 62.8
2007-04-05T22:09 61.4
2007-04-05T22:10 64.0
2007-04-05T22:11 67.5
2007-04-05T22:12 69.4
temperature temp-2
2007-04-05T22:01 69.5
2007-04-05T22:02 70.1
2007-04-05T22:03 71.3
2007-04-05T22:04 71.5
2007-04-05T22:05 69.8
humidity hum-1
2007-04-05T22:04 45.2
2007-04-05T22:05 45.3
2007-04-05T22:06 45.1
humidity hum-2
2007-04-05T22:04 44.4
2007-04-05T22:05 43.9
2007-04-05T22:06 44.9
2007-04-05T22:07 43.8
2007-04-05T22:08 42.1
monoxide mon-1
2007-04-05T22:04 5
2007-04-05T22:05 7
2007-04-05T22:06 9
monoxide mon-2
2007-04-05T22:04 2
2007-04-05T22:05 4
2007-04-05T22:06 10
2007-04-05T22:07 8
2007-04-05T22:08 6
```

## Goal

As a developer, your task is to process the log files and automate the quality control evaluation.

The evaluation criteria are as follows:

* For a thermometer, it is branded “ultra precise” if the mean of the readings is within 0.5 degrees of the known temperature, and the standard deviation is less than 3. It is branded “very precise” if the mean is within 0.5 degrees of the room, and the standard deviation is under 5. Otherwise, it’s sold as “precise”.
* For a humidity sensor, it must be discarded unless it is within 1 humidity percent of the reference value for all readings. (All humidity sensor readings are a decimal value representing percent moisture saturation.)
* For a carbon monoxide detector, it must be discarded unless it is within 3 ppm of the reference value for all readings. (All carbon monoxide readings are an integer value representing parts per million.)

## Architecture

This app architecture uses the **Strategy Design Pattern**, which encapsulates similar families of algorithms. In this case, we have a different algorithm for each sensor. You can find the classes and interface at `sensors-quality-assurance/src/services` folder. It's possible to add a new sensor only by changing the `sensors-quality-assurance/src/services/SensorService.ts` file. All other files like `SensorAccuracy.ts` and classes are **closed to changes** but **open for extensions**, which follows the **Open-Closed Principle** from **SOLID**.

## Aditional Libraries

For the front end the app uses **React**, **React Hook Form**, and **TypeScript**.

## Screenshots

https://github.com/darde/sensors-quality-control/assets/24977035/59cbb9cf-c4e2-42d1-ae66-c968bd5e05f7

## Running

Clone the repo and run the following commands on a terminal:
TIP: use the log file above to test the application.

```bash
npm install
npm run dev
```
