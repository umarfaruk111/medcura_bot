import React from "react";

export default function ChatWindow({ messages, loading }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-lg">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 max-w-lg rounded-lg ${
            msg.sender === "user"
              ? "bg-blue-600 text-white self-end ml-auto"
              : "bg-gray-200 text-gray-800 self-start"
          }`}
        >
          {msg.text}
        </div>
      ))}
      {loading && (
        <div className="text-gray-500 text-sm italic">Medcura is typing...</div>
      )}
    </div>
  );
}
