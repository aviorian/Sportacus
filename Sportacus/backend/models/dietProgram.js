
import { Schema, model } from "mongoose";

const dietProgramSchema = new Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    detail: {type: String, required: true },
    targetCalories: { type: Number, required: true },
    targetMacros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default model("dietProgram", dietProgramSchema);