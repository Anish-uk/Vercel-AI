"use client";
import { useState } from "react";
import { handleGenerateText } from "./action"; // Import the action for handling text generation

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", content: "Gemini AI response will appear here!" },
  ]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input) {
      const userMessage = { role: "user", content: input };
      const generatedText = await handleGenerateText(input); // Use action.js to fetch AI response
      const aiMessage = {
        role: "ai",
        content:
          generatedText || "Error: Could not fetch response from Gemini AI.",
      };

      // Update chat history
      setChatHistory([...chatHistory, userMessage, aiMessage]);
      setInput(""); // Clear the input field
    } else {
      alert("Please enter some text.");
    }
  };

  return (
    <div className="layout-container">
      <main>
        {/* Chat history display */}
        <div className="chat-container">
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              <p>{message.content}</p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your text here"
            className="input-field"
          />
          <button type="submit" className="submit-btn">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
