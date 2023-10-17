import { useEffect, useState } from "react";
import { handleOnLoadProps } from "../types";

// type measurement = {
//   device: string;
//   accuracy: string;
// };

// type DashboardProps = {
//   temperature: measurement[];
//   humidity: measurement[];
//   monoxide: measurement[];
// };
type key = {
  label?: string;
  data?: { device: string; accuracy: string }[];
};

type keyProps = key[];

const Dashboard = ({
  measurementData,
}: {
  measurementData?: handleOnLoadProps | null;
}) => {
  const [results, setResults] = useState<keyProps | []>([]);

  useEffect(() => {
    if (measurementData) {
      const keys: keyProps = [];
      Object.keys(measurementData).forEach((key) => keys.push({ label: key }));

      Object.entries(measurementData).forEach(
        (entry, index) => (keys[index]["data"] = entry[1])
      );

      setResults(keys);
    }
  }, [measurementData]);

  return (
    <div className="mt-10">
      {measurementData && (
        <div className="flex flex-col items-center">
          <h1>Results</h1>
          <div className="w-screen max-w-[90%] rounded p-4 flex flex-wrap justify-center shadow-sm">
            {results.map((value) => {
              return (
                <div className="w-[300px] border border-zinc-400 rounded m-3 px-3 flex flex-col justify-start items-start">
                  <h1 className="text-center w-full">{value.label}</h1>
                  {value.data!.map((item) => (
                    <h2>
                      <strong>{item.device}</strong>: {item.accuracy}
                    </h2>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
