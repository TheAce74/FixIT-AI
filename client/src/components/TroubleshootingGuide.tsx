import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const TroubleshootingGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<
    {
      title: string;
      content: string;
      image: string;
    }[]
  >([]);
  const location = useLocation();

  const fetchSolutions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/solutions/generate",
        {
          description: location.state?.diagnosis,
          problem: location.state?.problem,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSteps(
        response.data.steps.map((step: string, index: number) => ({
          title: `Step ${index + 1}`,
          content: step,
          image: "https://picsum.photos/600/400",
        }))
      );
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSolutions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Troubleshooting Guide</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        {steps.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2">
              {steps[currentStep].title}
            </h3>
            <img
              src={steps[currentStep].image || "/placeholder.svg"}
              alt={steps[currentStep].title}
              className="h-[400px] aspect-[3/2] object-cover rounded-lg mb-4"
            />
            <p className="mb-4">{steps[currentStep].content}</p>
            <div className="flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="bg-secondary text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
        {steps.length === 0 && !loading && (
          <p>No troubleshooting steps available.</p>
        )}
        {loading && <p>Generating solution...</p>}
      </div>
    </div>
  );
};

export default TroubleshootingGuide;
