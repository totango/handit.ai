import { sendEmail } from "../services/emailService.js";
export const testSend = async (req, res) => {
  try {
    await sendEmail(
      {
        to: "gfcristhian98@gmail.com",
        subject: "Test Email",
        text: "This is a test email",
        html: "<p>This is a test email</p>",
        attachments: []
      }
    )
    res.status(201).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
