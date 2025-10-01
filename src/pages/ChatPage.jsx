import React, { useState, useRef, useEffect } from "react";
import useChat from "../hooks/useChat";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";  // ✅ new import

export default function ChatPage() {
  const { messages, send, loading } = useChat();
  const { user, signOut } = useAuth(); // ✅ get user + signOut
  const [query, setQuery] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    send(query.trim());
    setQuery("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl overflow-hidden">
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Medcura Bot</h1>
            <p className="text-sm text-gray-500">
              Hello, {user?.name}! Ask for health tips or guidance.
            </p>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-red-600 hover:underline"
          >
            Sign Out
          </button>
        </header>

        <main className="p-4 h-[70vh] flex flex-col">
          <ChatWindow messages={messages} loading={loading} />
          <form onSubmit={onSubmit} className="mt-3 flex gap-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg border"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
