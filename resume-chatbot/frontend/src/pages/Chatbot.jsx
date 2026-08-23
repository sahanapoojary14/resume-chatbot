import React from "react";
import ChatWindow from "../components/ChatWindow";

export default function Chatbot() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left side (future: chat history or upload options) */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-3">Chat History</h2>
        <p className="text-gray-500">This section will show past messages.</p>
      </div>

      {/* Right side - Chat window */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          AI Resume Builder
        </h1>
        <ChatWindow />
      </div>
    </div>
  );
}
