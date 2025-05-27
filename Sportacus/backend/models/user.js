import { Schema, model } from "mongoose";


// Define the TrainingProfile sub-schema first
const TrainingProfile = new Schema(
  {
    target: {
      type: String,
      required: false,
      enum: ["Gain Weight", "Lose Weight", "Eat Healthy", "Muscle Building"],
    },
  },
  { _id: false } // prevents creation of a separate _id for the subdocument
);


// Now define the main user schema and use TrainingProfile as a subdocument
const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    birthCountry: { type: String, required: true },
    birthCity: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    
    TrainingProfile: TrainingProfile, // <-- subdocument

    dietProgram: { type: Schema.Types.ObjectId, ref: "dietProgram" }, // reference to dietProgram model
    
  },
  { timestamps: true }
);

export default model("User", userSchema);
