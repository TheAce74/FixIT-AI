import type React from "react";
import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

type Solution = {
  title: string;
  description: string;
  steps: string[];
  confidenceScore: number;
  problem: {
    category: "software" | "hardware" | "network";
    title: string;
    description: string;
    symptoms: string[];
  };
  hidden: boolean;
};

const SolutionDisplay: React.FC = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const response = await axiosInstance.get("/api/solutions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSolutions(
          response.data.map((datum: Solution) => ({ ...datum, hidden: true }))
        );
      } catch (error) {
        console.error("Error fetching solutions:", error);
      }
    };
    fetchSolutions();
  }, []);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Previous Solutions</h2>
      <div className="space-y-4">
        {solutions.map((solution, index) => (
          <div key={index} className="bg-gray-800 rounded-lg px-6 py-3">
            <h3 className="text-xl font-semibold mb-2">
              {solution.problem.title}
            </h3>
            <p className="mb-2">{solution.problem.symptoms.join(", ")}</p>
            {/* <div className="mb-2">
              <span className="font-semibold">Confidence Score: </span>
              <span className="text-primary">
                {(solution.confidenceScore * 100).toFixed(0)}%
              </span>
            </div> */}
            <button
              className="bg-secondary text-white px-4 py-2 rounded mb-4"
              onClick={() =>
                setSolutions((prev) => [
                  ...prev.slice(0, index),
                  {
                    ...solution,
                    hidden: !solution.hidden,
                  },
                  ...prev.slice(index + 1),
                ])
              }
            >
              {solution.hidden ? "More Details" : "Less Details"}
            </button>
            <ol
              className={`list-decimal list-inside ${
                solution.hidden && "hidden"
              }`}
            >
              {solution.steps.map((step: string, stepIndex) => (
                <li key={stepIndex} className="mb-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolutionDisplay;
