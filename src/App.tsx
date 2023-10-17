
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Form from "./components/Form";
import "./styles/global.css";
import { handleOnLoadProps } from "./types";

function App() {
  const [measurements, setMeasurements] = useState<handleOnLoadProps | null>();

  const handleOnLoad = (measurementData: handleOnLoadProps) => {
    setMeasurements(measurementData);
  };

  return (
    <div className="h-screen w-screen items-center justify-center flex flex-col">
      <h1>Sensors Quality Control</h1>
      <p>Upload a log file to evaluate the sensors quality.</p>
      <Form handleOnLoad={handleOnLoad} />
      <Dashboard measurementData={measurements} />
    </div>
  );
}

export default App
