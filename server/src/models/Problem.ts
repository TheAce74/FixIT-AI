import mongoose, { type Document, Schema } from "mongoose"

export interface IProblem extends Document {
  category: "software" | "hardware" | "network"
  title: string
  description: string
  symptoms: string[]
}

const ProblemSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["software", "hardware", "network"],
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    symptoms: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.model<IProblem>("Problem", ProblemSchema)

