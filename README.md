🤖 AI Resume Builder

An AI-powered resume builder that helps users create professional resumes through a simple conversational chatbot. It uses Google Gemini AI to improve resume content and generates downloadable PDF resumes using different templates.

✨ Features
💬 Conversational resume creation
🤖 AI-powered content improvement using Gemini
📄 Automatic PDF resume generation
🎨 Multiple resume templates
💾 Chat history using localStorage
⚡ React + Node.js architecture
🛠️ Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios
Backend: Node.js, Express.js
AI: Google Gemini API
PDF: PDFKit
Storage: Browser localStorage

🚀 Setup
1. Clone the repository
git clone <repository-url>
cd resume-chatbot
2. Backend
cd backend
npm install

Create a .env file:

GEMINI_API_KEY=your_api_key
PORT=5000

Start the server:

npm start
3. Frontend
cd frontend
npm install
npm run dev

Open the URL provided by Vite in your browser.

🔄 How It Works
User → Chatbot → Resume Information → Gemini AI
                                      ↓
                              Template Selection
                                      ↓
                                  PDF Resume




🔮 Future Improvements
User authentication
ATS resume scoring
More resume templates
Database integration
Job-description-based resume optimization
Cloud deployment
