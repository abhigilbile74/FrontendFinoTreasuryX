import { useDispatch, useSelector } from "react-redux";
// import { toggleChatbot, addMessage } from "../redux/slices/chatbotSlice";
import { toggleChatbot, addMessage } from "../store/slices/chatbotSlice";
import ChatMessage from "../chatbot/ChatMessage";
import ChatInput from "../chatbot/ChatInput";
import axiosInstance from "../api/axiosInstance";

export default function ChatbotWidget() {
  const dispatch = useDispatch();

  const { open, messages } = useSelector((state) => state.chatbot);

  const sendMessage = async (text) => {
    dispatch(addMessage({ sender: "user", text }));

    try {
      const response = await axiosInstance.post("chatbot/ask/", {
        message: text,
      });

      const data = response.data;
      dispatch(addMessage({ 
        sender: "bot", 
        text: data.bot_reply || data.reply || "Sorry, I couldn't process that." 
      }));
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
      
      dispatch(
        addMessage({
          sender: "bot",
          text: errorMessage,
        })
      );
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg text-xl md:text-2xl z-50 transition-all"
        onClick={() => dispatch(toggleChatbot())}
        aria-label="Open chatbot"
      >
        💬
      </button>

      {/* Chatbox */}
      {open && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => dispatch(toggleChatbot())}
          />
          
          {/* Chatbox */}
          <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] md:w-80 md:max-w-md h-[calc(100vh-6rem)] md:h-96 max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col p-3 md:p-4 z-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
              <h3 className="font-bold text-base md:text-lg">AI Finance Bot</h3>
              <button
                onClick={() => dispatch(toggleChatbot())}
                className="md:hidden text-gray-500 hover:text-gray-700 text-xl"
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2 md:p-3 rounded-md mb-2">
              {messages.map((msg, i) => (
                <ChatMessage key={i} sender={msg.sender} text={msg.text} />
              ))}
            </div>

            {/* Input */}
            <ChatInput onSend={sendMessage} />
          </div>
        </>
      )}
    </>
  );
}
