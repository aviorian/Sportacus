import { Schema, model } from "mongoose";


// Define the TrainingProfile sub-schema first
const TrainingProfile = new Schema(
  {
    target: {
      type: String,
      required: false,
      enum: ["Gain Weight", "Lose Weight", "Eat Healthy", "Muscle Building"],
    },
    weight: { type: Number }, // in kg
    height: { type: Number }, // in cm
    bmi: { type: Number }, // calculated, can be set by backend or frontend
    chronicIllnesses: [{
      type: String,
      enum: [
        "Insulin Resistance",
        "Diabetes Disease",
        "Cardiovascular Diseases",
        "Fatty Liver",
        "Thyroid Disorder",
        "Blood pressure",
        "High Cholesterol"
      ]
    }],
    workingStyle: {
      type: String,
      enum: [
        "I'm in the Office or at Home",
        "I Work Standing",
        "Daily Long Walks",
        "I Work in a Job That Requires Physical Strength"
      ]
    },
    physicalActivity: {
      type: String,
      enum: [
        "Usually Inactive",
        "1-3 Days a Week",
        "4-5 Days a Week",
        "6-7 Days a Week",
        "Professional Athlete"
      ]
    },
    habits: [{
      type: String,
      enum: [
        "I eat late.",
        "My sleep is irregular.",
        "I consume alcohol or carbonated drinks.",
        "I have sweet cravings.",
        "My meals are irregular.",
        "I skip breakfast.",
        "I have an emotional eating problem."
      ]
    }]
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
