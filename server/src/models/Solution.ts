import mongoose, { type Document, Schema } from "mongoose"

export interface ISolution extends Document {
  problem: mongoose.Types.ObjectId
  description: string
  steps: string[]
  confidenceScore: number
}

const SolutionSchema: Schema = new Schema(
  {
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    description: { type: String, required: true },
    steps: [{ type: String, required: true }],
    confidenceScore: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISolution>("Solution", SolutionSchema)

