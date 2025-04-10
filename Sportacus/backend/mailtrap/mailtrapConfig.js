import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: "6b3c72b200a76c3214e2a7cc12700252",// process.env.MAILTRAP_API_TOKEN || "YOUR_MAILTRAP_API_TOKEN";
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "GetGood Team",
};
