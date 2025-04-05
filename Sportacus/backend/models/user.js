import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    birthCountry: {
      type: String,
      required: true,
    },
    birthCity: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], // To control allowed values
    },
    address: {
      type: String, // Optional free text
    },
    phoneNumber: {
      type: String, // Optional
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true, //hashed password
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);
