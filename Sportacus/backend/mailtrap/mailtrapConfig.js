import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
const __dirname = dirname(fileURLToPath(import.meta.url)); //get directory name of the current module
dotenv.config({ path: path.resolve(__dirname, "../../.env") }); //../../.env means go up two directories from the current file and find .env file
//path.resolve combines both

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_API_TOKEN,// process.env.MAILTRAP_API_TOKEN || "YOUR_MAILTRAP_API_TOKEN";
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "GetGood Team",
};
