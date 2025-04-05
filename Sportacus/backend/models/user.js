import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // No duplicates
    },
    email: {
      type: String,
      required: true,
      unique: true, // No duplicates
    },
    password: {
      type: String,
      required: true, // Hashed password
    },
  },
  { timestamps: true }
); // Automatically adds createdAt & updatedAt

export default model("User", userSchema);
