import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure resumes output directory exists
const resumesDir = path.join(__dirname, "resumes");
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

// Serve generated PDF files statically
app.use("/resumes", express.static(resumesDir));

// Initialize Gemini AI (using active model gemini-3.6-flash)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

// Helper to extract fields from form response data
const getField = (data, keys, fallback = "") => {
  for (const k of keys) {
    if (data && data[k]) return data[k];
  }
  return fallback;
};

const extractResumeData = (data = {}) => {
  return {
    name: getField(data, ["What is your full name?", "name", "fullName"], "Your Name"),
    email: getField(data, ["What is your email address?", "email"], ""),
    phone: getField(data, ["What is your phone number?", "phone"], ""),
    summary: getField(data, ["What is your professional summary?", "summary"], ""),
    education: getField(data, ["List your educational qualifications.", "education"], ""),
    experience: getField(data, ["Describe your work experience.", "experience"], ""),
    skills: getField(data, ["List your skills.", "skills"], ""),
    projects: getField(data, ["Mention your projects (if any).", "projects"], ""),
    certifications: getField(data, ["Any certifications or achievements?", "certifications"], ""),
  };
};

// Generate PDF using PDFKit based on selected template
const generatePDFDocument = (resumeData, template, outputPath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const { name, email, phone, summary, education, experience, skills, projects, certifications } = resumeData;

    if (template === "modern") {
      // Modern Template: Dark Header Banner with Accent Color
      doc.rect(0, 0, doc.page.width, 95).fill("#1E293B");
      doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text(name, 40, 25);
      const contactInfo = [email, phone].filter(Boolean).join("   |   ");
      doc.fillColor("#94A3B8").fontSize(10).font("Helvetica").text(contactInfo, 40, 58);
      doc.y = 115;
    } else if (template === "minimal") {
      // Minimal Template: Clean, subtle lines, modern gray typography
      doc.fillColor("#0F172A").fontSize(22).font("Helvetica-Bold").text(name);
      const contactInfo = [email, phone].filter(Boolean).join("   •   ");
      doc.fillColor("#64748B").fontSize(10).font("Helvetica").text(contactInfo);
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor("#CBD5E1").lineWidth(0.5).stroke();
      doc.moveDown(1);
    } else {
      // Classic Template: Centered Header, Dark Blue lines
      doc.fillColor("#1E3A8A").fontSize(24).font("Helvetica-Bold").text(name, { align: "center" });
      const contactInfo = [email, phone].filter(Boolean).join("   |   ");
      doc.fillColor("#475569").fontSize(10).font("Helvetica").text(contactInfo, { align: "center" });
      doc.moveDown(0.5);
      doc.moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).strokeColor("#1E3A8A").lineWidth(1.5).stroke();
      doc.moveDown(1);
    }

    const addSection = (title, content) => {
      if (!content || !content.trim()) return;

      if (doc.y > 720) {
        doc.addPage();
      } else {
        doc.moveDown(0.8);
      }

      if (template === "modern") {
        doc.fillColor("#4F46E5").fontSize(12).font("Helvetica-Bold").text(title.toUpperCase());
        doc.moveTo(40, doc.y + 2).lineTo(220, doc.y + 2).strokeColor("#4F46E5").lineWidth(1.5).stroke();
      } else if (template === "minimal") {
        doc.fillColor("#334155").fontSize(11).font("Helvetica-Bold").text(title.toUpperCase());
        doc.moveTo(40, doc.y + 2).lineTo(doc.page.width - 40, doc.y + 2).strokeColor("#E2E8F0").lineWidth(0.5).stroke();
      } else {
        // Classic
        doc.fillColor("#1E3A8A").fontSize(12).font("Helvetica-Bold").text(title.toUpperCase());
        doc.moveTo(40, doc.y + 2).lineTo(doc.page.width - 40, doc.y + 2).strokeColor("#94A3B8").lineWidth(0.75).stroke();
      }
      doc.moveDown(0.5);

      doc.fillColor("#334155").fontSize(10).font("Helvetica").text(content.trim(), { lineGap: 3 });
    };

    addSection("Professional Summary", summary);
    addSection("Work Experience", experience);
    addSection("Education", education);
    addSection("Skills", skills);
    addSection("Projects", projects);
    addSection("Certifications & Achievements", certifications);

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
  });
};

// API endpoint to generate PDF resume
app.post("/api/generate-resume", async (req, res) => {
  try {
    const { data, template = "classic" } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No resume data provided" });
    }

    const resumeData = extractResumeData(data);
    const filename = `resume_${Date.now()}.pdf`;
    const outputPath = path.join(resumesDir, filename);

    await generatePDFDocument(resumeData, template, outputPath);

    res.json({
      success: true,
      file: `/resumes/${filename}`,
    });
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res.status(500).json({
      error: "Failed to generate PDF resume.",
      details: error.message,
    });
  }
});

// API endpoint to improve text
app.post("/api/improve-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Improve this text professionally: ${text}` }],
        },
      ],
    });

    const improved = result.response.text();
    res.json({ improved });
  } catch (error) {
    console.error("Error improving text:", error);
    res.status(500).json({
      error: "Failed to generate improved summary.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

