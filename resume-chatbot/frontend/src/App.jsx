import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [completedData, setCompletedData] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [history, setHistory] = useState([]);

  const questions = [
    "What is your full name?",
    "What is your email address?",
    "What is your phone number?",
    "What is your professional summary?",
    "List your educational qualifications.",
    "Describe your work experience.",
    "List your skills.",
    "Mention your projects (if any).",
    "Any certifications or achievements?",
  ];

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Start first question automatically
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ sender: "bot", text: questions[0] }]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    // Save chat history
    const newHistory = [
      ...history,
      { question: questions[step], answer: input },
    ];
    setHistory(newHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newHistory));

    // Update form data
    const newForm = { ...formData, [questions[step]]: input };
    setFormData(newForm);
    setInput("");

    if (step < questions.length - 1) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { sender: "bot", text: questions[step + 1] },
        ]);
        setStep(step + 1);
      }, 500);
    } else {
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "✅ Great! Your resume data is complete. Choose a template below to generate your resume PDF.",
        },
      ]);
      setCompletedData(newForm);
    }
  };

  // 🧠 Improve input text using Gemini AI
  const improveText = async () => {
    if (!input.trim()) return;
    setIsImproving(true);
    setErrorMsg("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/improve-text`,
        { text: input }
      );
      if (res.data.improved) {
        setInput(res.data.improved);
      }
    } catch (err) {
      console.error("AI Improve Error:", err);
      setErrorMsg("Could not improve text. Check backend connection.");
    } finally {
      setIsImproving(false);
    }
  };

  const generateResume = async (template) => {
    setIsGenerating(true);
    setErrorMsg("");
    setResumeLink("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/generate-resume`,
        { data: completedData, template }
      );
      if (res.data && res.data.file) {
        setResumeLink(`${import.meta.env.VITE_API_URL}${res.data.file}`);
      }
    } catch (error) {
      console.error("Resume Generation Error:", error);
      setErrorMsg("Failed to generate resume. Please ensure the backend server is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("chatHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar for chat history */}
      <div className="w-1/4 bg-white p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Chat History</h2>
        <div className="h-[75vh] overflow-y-auto border p-2 rounded mb-3">
          {history.length > 0 ? (
            history.map((item, i) => (
              <div key={i} className="mb-2">
                <p className="text-sm text-gray-700">
                  <b>Q:</b> {item.question}
                </p>
                <p className="text-sm text-gray-500">
                  <b>A:</b> {item.answer}
                </p>
                <hr className="my-1" />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No history yet.</p>
          )}
        </div>
        <button
          onClick={clearHistory}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Clear History
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-4">AI Resume Builder</h1>

        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md">
          <div className="h-96 overflow-y-auto border p-3 rounded mb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-xl ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm mb-3 text-center bg-red-50 p-2 rounded border border-red-200">
              {errorMsg}
            </p>
          )}

          {!completedData && (
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your answer..."
              />
              <button
                onClick={improveText}
                disabled={isImproving || !input.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-2 rounded transition"
              >
                {isImproving ? "Improving..." : "✨ Improve"}
              </button>
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition"
              >
                Send
              </button>
            </div>
          )}

          {completedData && (
            <div className="text-center mt-4">
              <p className="mb-3 font-semibold text-gray-700">
                Choose a template to generate your resume:
              </p>

              {isGenerating ? (
                <div className="p-4 text-blue-600 font-medium animate-pulse">
                  📄 Generating your PDF resume...
                </div>
              ) : (
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => generateResume("classic")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
                  >
                    Classic Template
                  </button>
                  <button
                    onClick={() => generateResume("modern")}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition"
                  >
                    Modern Template
                  </button>
                  <button
                    onClick={() => generateResume("minimal")}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded shadow transition"
                  >
                    Minimal Template
                  </button>
                </div>
              )}

              {resumeLink && (
                <div className="mt-5 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium mb-1">🎉 Resume Generated Successfully!</p>
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-medium transition shadow mt-1"
                  >
                    📥 View & Download Resume PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
