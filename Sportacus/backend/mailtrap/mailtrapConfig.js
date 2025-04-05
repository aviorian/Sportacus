import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const mailtrapClient = new MailtrapClient({
  token: "5066a758335204d8ad840b0fd1db5cd6",// process.env.MAILTRAP_API_TOKEN || "YOUR_MAILTRAP_API_TOKEN";
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Hasan",
};
