import express from "express";
import Solution from "../models/Solution";
import OpenAI from "openai";
import "dotenv/config";

const router = express.Router();

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

router.get("/", async (req, res) => {
  try {
    const solutions = await Solution.find()
      .populate("problem")
      .sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching solutions", error });
  }
});

router.get("/:problemId", async (req, res) => {
  try {
    const solutions = await Solution.find({ problem: req.params.problemId });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching solution", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { problem, description, steps, confidenceScore } = req.body;
    const solution = new Solution({
      problem,
      description,
      steps,
      confidenceScore,
    });
    await solution.save();
    res.status(201).json(solution);
  } catch (error) {
    res.status(400).json({ message: "Error creating solution", error });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const { problem, description } = req.body;
    const prompt = `Given the computer problem: "${description}". Provide a step-by-step solution to resolve this issue, in json format
    i.e. {
      "steps": [
        "",
        ...
      ]
    }
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    const generatedSolution = completion.choices[0].message.content?.trim();
    const steps = JSON.parse(
      String(generatedSolution).split("```json").join("").split("```").join("")
    );

    const solution = new Solution({
      problem,
      description: "AI-generated solution",
      steps: steps.steps,
      confidenceScore: 0.8,
    });

    await solution.save();
    res.status(201).json(solution);
  } catch (error) {
    res.status(500).json({ message: "Error generating solution", error });
  }
});

export default router;
