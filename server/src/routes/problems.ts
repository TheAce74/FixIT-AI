import express from "express";
import Problem from "../models/Problem";
import OpenAI from "openai";
import "dotenv/config";

const router = express.Router();

const openai = new OpenAI({
  baseURL: "https://models.inference.ai.azure.com",
  apiKey: process.env.GITHUB_TOKEN,
});

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json({
      problems,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { category, title, description, symptoms } = req.body;
    const problem = new Problem({ category, title, description, symptoms });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ message: "Error creating problem", error });
  }
});

router.post("/diagnose", async (req, res) => {
  try {
    const { symptoms } = req.body;
    const prompt = `Given the following computer problem symptoms: ${symptoms.join(
      ", "
    )}. Diagnose the issue and suggest possible solutions.`;

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

    const diagnosis = completion.choices[0].message.content?.trim();
    res.json({ diagnosis });
  } catch (error) {
    res.status(500).json({ message: "Error diagnosing problem", error });
  }
});

export default router;
