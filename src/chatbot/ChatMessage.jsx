export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`my-3 md:my-4 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-3 py-2 md:px-4 md:py-3 rounded-lg max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl shadow-md text-sm md:text-base break-words ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
        }`}
      >
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
    </div>
  );
}
