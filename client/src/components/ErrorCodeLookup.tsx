import type React from "react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import Markdown from "markdown-to-jsx";

const ErrorCodeLookup: React.FC = () => {
  const [searchCode, setSearchCode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/problems/diagnose",
        { symptoms: [searchCode] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResult(response.data.diagnosis);
    } catch (error) {
      console.error("Error looking up error code:", error);
      setResult("Error code not found");
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Error Code Lookup</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Enter error code (and brief description if any)"
          className="w-full p-2 rounded bg-gray-700 text-white mb-2"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
        >
          Search
        </button>
      </form>
      {result && (
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Result:</h3>
          <Markdown>{result}</Markdown>
        </div>
      )}
    </div>
  );
};

export default ErrorCodeLookup;
