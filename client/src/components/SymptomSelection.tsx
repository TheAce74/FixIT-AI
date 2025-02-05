import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const categories = ["software", "hardware", "network"];
const commonIssues = [
  "PC won't start",
  "Overheating",
  "Slow performance",
  "Blue screen of death",
  "No internet connection",
];

const SymptomSelection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [problems, setProblems] = useState<
    {
      category: "software" | "hardware" | "network";
      title: string;
      description: string;
      symptoms: string[];
    }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosInstance.get("/api/problems", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProblems(response.data.problems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (searchKeyword.trim() !== "") {
      setSelectedIssues((prev) => [...prev, searchKeyword.trim()]);
    }
    e.preventDefault();
    if (!selectedCategory || selectedIssues.length === 0) {
      return;
    }
    try {
      const responses = await Promise.all([
        axiosInstance.post(
          "/api/problems/diagnose",
          { symptoms: selectedIssues },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        axiosInstance.post(
          "/api/problems",
          {
            category: selectedCategory,
            title: `${
              selectedCategory[0].toUpperCase() + selectedCategory.slice(1)
            } problem`,
            description: "N/A",
            symptoms: selectedIssues,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
      ]);
      navigate("/troubleshoot", {
        state: {
          diagnosis: responses[0].data.diagnosis,
          problem: responses[1].data._id,
        },
      });
    } catch (error) {
      console.error("Error diagnosing problem:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Select Your Symptoms</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block mb-2">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Common Issues:</p>
          <div className="space-y-2">
            {commonIssues.map((issue) => (
              <label key={issue} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIssues.includes(issue)}
                  onChange={() => handleIssueToggle(issue)}
                  className="mr-2"
                />
                {issue}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="search" className="block mb-2">
            Enter symptoms (optional):
          </label>
          <input
            type="text"
            id="search"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter keywords..."
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Start Troubleshooting
        </button>
      </form>
      {problems.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Previous problems</h2>
          <ul className="space-y-4">
            {problems.map((problem) => (
              <li key={problem.title} className="space-y-1">
                <p className="grid grid-cols-2">
                  <span className="font-medium">Title:</span>
                  <span>{problem.title}</span>
                </p>
                <p className="grid grid-cols-2">
                  <span className="font-medium">Category:</span>
                  <span>{problem.category}</span>
                </p>
                <p className="grid grid-cols-2">
                  <span className="font-medium">Symptoms:</span>
                  <span>{problem.symptoms.join(", ")}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomSelection;
