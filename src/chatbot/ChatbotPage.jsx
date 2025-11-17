import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axiosInstance";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about money, investments, or budgeting." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("chatbot/ask/", {
        message: text,
      });

      const data = response.data;
      const botMsg = { 
        sender: "bot", 
        text: data.bot_reply || data.reply || "Sorry, I couldn't process that." 
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error("Chatbot error:", err);
      let errorMessage = "⚠️ Unable to reach chatbot server. Please make sure you're logged in.";
      
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          errorMessage = "⚠️ Please log in to use the chatbot.";
        } else if (err.response.status === 500) {
          errorMessage = "⚠️ Server error. The chatbot service may be experiencing issues. Please try again later.";
        } else if (err.response.data?.error) {
          errorMessage = `⚠️ ${err.response.data.error}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "⚠️ Unable to connect to the server. Please check your internet connection.";
      }
      
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="w-full h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              AI Finance Assistant
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Get personalized financial advice, budget tips, and investment insights
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 min-h-full">
              {messages.map((msg, index) => (
                <ChatMessage key={index} sender={msg.sender} text={msg.text} />
              ))}
              {isLoading && (
                <div className="flex justify-start my-2">
                  <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600">
                    <div className="flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Container */}
        <div className="w-full bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-lg px-4 md:px-6 py-4 md:py-6">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
