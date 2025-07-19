const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const OnboardingSchema = new mongoose.Schema({
  fullName: String,
  mobile: String,
  email: String,
  city: String,
  propertyType: String,
  budget: String,
  message: String
});
const Onboarding = mongoose.model('Onboarding', OnboardingSchema);

// ✅ Email function
const sendConfirmationEmail = async (to, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Form Submission Confirmation",
      html: `<h3>Hello ${name},</h3><p>Thank you for your submission. We'll get back to you soon!</p>`
    });

    console.log("📧 Confirmation email sent to", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

// POST API
app.post('/api/onboarding', async (req, res) => {
  try {
    const newEntry = new Onboarding(req.body);
    await newEntry.save();

    // 📧 Send confirmation email
    sendConfirmationEmail(newEntry.email, newEntry.fullName);

    res.status(201).json({ message: 'Submission successful' });
  } catch (err) {
    console.error('❌ Submission failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
