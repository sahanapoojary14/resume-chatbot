import React, { useState } from "react";
import axios from "axios";
import "./ChatWindow.css";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { text: "What is your full name?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [resumeData, setResumeData] = useState({});

  // Frontend environment variable (must be set in .env)
  const apiUrl = import.meta.env.VITE_API_URL;

  // -------------------------------
  // Function: Send user message
  // -------------------------------
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    setInput("");

    const lastQuestion = messages[messages.length - 1]?.text;
    let nextQuestion = "";

    // Resume-building question logic
    if (lastQuestion.includes("full name")) {
      setResumeData({ ...resumeData, name: input });
      nextQuestion = "What is your email address?";
    } else if (lastQuestion.includes("email")) {
      setResumeData({ ...resumeData, email: input });
      nextQuestion = "What is your phone number?";
    } else if (lastQuestion.includes("phone")) {
      setResumeData({ ...resumeData, phone: input });
      nextQuestion = "What is your professional summary?";
    } else if (lastQuestion.includes("summary")) {
      setResumeData({ ...resumeData, summary: input });
      nextQuestion =
        "Great! Your details are saved. Click '✨ Improve' to enhance your summary.";
    }

    if (nextQuestion) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: nextQuestion, sender: "bot" }]);
      }, 500);
    }
  };

  // -------------------------------
  // Function: Improve summary using Gemini
  // -------------------------------
  const handleImprove = async () => {
    console.log("✅ Improve button clicked!");
    if (!resumeData.summary) {
      alert("Please enter your professional summary first!");
      return;
    }

    setIsImproving(true);

    try {
      console.log("Sending request to:", `${apiUrl}/api/improve-text`);

      const response = await axios.post(`${apiUrl}/api/improve-text`, {
        text: resumeData.summary,
      });

      console.log("Response from backend:", response.data);

      const improved = response.data.improved || "No improvement found.";
      setMessages((prev) => [
        ...prev,
        { text: `✨ Improved summary: ${improved}`, sender: "bot" },
      ]);
    } catch (error) {
      console.error("❌ Error improving text:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I couldn't improve your summary. Try again later.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsImproving(false);
    }
  };

  // -------------------------------
  // UI rendering
  // -------------------------------
  return (
    <div className="chat-container">
      <h1>AI Resume Builder</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}

        {isImproving && (
          <div className="chat-message bot">✨ Improving your summary...</div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={handleImprove} disabled={isImproving}>
          {isImproving ? "Improving..." : "✨ Improve"}
        </button>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
