<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Resume Builder</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f5f7fa;
            color: #24292f;
            line-height: 1.6;
        }

        .container {
            max-width: 900px;
            margin: 40px auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        h1 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 15px;
            font-size: 32px;
        }

        h2 {
            color: #2563eb;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
        }

        p {
            margin-bottom: 15px;
        }

        ul {
            margin-left: 25px;
            margin-bottom: 20px;
        }

        li {
            margin-bottom: 8px;
        }

        .tech-stack {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 15px;
        }

        .tech-item {
            margin-bottom: 10px;
        }

        .tech-item strong {
            color: #111827;
        }

        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 15px 0;
            font-size: 14px;
        }

        code {
            font-family: "Courier New", monospace;
        }

        .author {
            text-align: center;
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }

        .author strong {
            font-size: 20px;
            color: #2563eb;
        }

        .badge {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin: 4px;
        }

        @media (max-width: 600px) {
            .container {
                margin: 20px;
                padding: 25px;
            }

            h1 {
                font-size: 26px;
            }
        }
    </style>
</head>

<body>

    <div class="container">

        <!-- Project Title -->
        <h1>🤖 AI Resume Builder</h1>

        <!-- Description -->
        <p>
            An AI-powered resume builder that helps users create professional
            resumes through a simple conversational chatbot. It uses
            <strong>Google Gemini AI</strong> to improve resume content and
            generates downloadable PDF resumes using different templates.
        </p>

        <!-- Features -->
        <h2>✨ Features</h2>

        <ul>
            <li>💬 Conversational resume creation</li>
            <li>🤖 AI-powered content improvement using Gemini</li>
            <li>📄 Automatic PDF resume generation</li>
            <li>🎨 Multiple resume templates</li>
            <li>💾 Chat history using localStorage</li>
            <li>⚡ React + Node.js architecture</li>
        </ul>

        <!-- Tech Stack -->
        <h2>🛠️ Tech Stack</h2>

        <div class="tech-stack">

            <div class="tech-item">
                <strong>Frontend:</strong>
                React, Vite, Tailwind CSS, Axios
            </div>

            <div class="tech-item">
                <strong>Backend:</strong>
                Node.js, Express.js
            </div>

            <div class="tech-item">
                <strong>AI:</strong>
                Google Gemini API
            </div>

            <div class="tech-item">
                <strong>PDF:</strong>
                PDFKit
            </div>

            <div class="tech-item">
                <strong>Storage:</strong>
                Browser localStorage
            </div>

        </div>

        <!-- Setup -->
        <h2>🚀 Setup</h2>

        <h3>1. Clone the repository</h3>

        <pre><code>git clone &lt;repository-url&gt;
cd resume-chatbot</code></pre>

        <h3>2. Backend</h3>

        <pre><code>cd backend
npm install</code></pre>

        <p>Create a <code>.env</code> file:</p>

        <pre><code>GEMINI_API_KEY=your_api_key
PORT=5000</code></pre>

        <p>Start the server:</p>

        <pre><code>npm start</code></pre>

        <h3>3. Frontend</h3>

        <pre><code>cd frontend
npm install
npm run dev</code></pre>

        <p>
            Open the URL provided by Vite in your browser.
        </p>

        <!-- How It Works -->
        <h2>🔄 How It Works</h2>

        <pre><code>User
  ↓
Chatbot
  ↓
Resume Information
  ↓
Gemini AI
  ↓
Template Selection
  ↓
PDF Resume</code></pre>

        <!-- Author -->
        <h2>👨‍💻 Author</h2>

        <div class="author">
            <strong>Sahana</strong>

            <p>
                Software Engineer |
                Full-Stack Developer |
                Cloud &amp; DevOps Enthusiast
            </p>

            <span class="badge">React</span>
            <span class="badge">Node.js</span>
            <span class="badge">Gemini AI</span>
            <span class="badge">Cloud</span>
            <span class="badge">DevOps</span>
        </div>

    </div>

</body>
</html>
