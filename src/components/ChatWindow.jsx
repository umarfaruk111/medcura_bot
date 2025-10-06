import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages, loading }) {
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {messages.map((msg, idx) => {
        const isUser = msg.sender === "user"; // Ensure your useChat hook sets sender: "user" or "bot"
        return (
          <div
            key={idx}
            className={`flex w-full ${
              isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] sm:max-w-[60%] px-4 py-2 rounded-2xl text-sm sm:text-base shadow ${
                isUser
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-700 px-3 py-2 rounded-2xl animate-pulse text-sm">
            Medcura Bot is typing...
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
