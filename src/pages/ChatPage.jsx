import React, { useState, useRef, useEffect } from "react";
import useChat from "../hooks/useChat";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react"; // ✅ For modern icons

export default function ChatPage() {
  const { messages, send, loading } = useChat();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    send(query);
    setQuery("");
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Successfully signed out 👋");
    navigate("/signin");
  };

  const quickPrompts = ["Healthy Meal Plan", "Better Sleep", "Cold Remedies"];

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
      {/* HEADER */}
      <header className="w-full max-w-3xl p-4 border-b flex items-center justify-between bg-white shadow-md rounded-t-xl relative">
        <div>
          <h1 className="text-xl font-semibold">Medcura Bot</h1>
          <p className="text-sm text-gray-500 hidden sm:block">
            Hello {user?.email}! How can I help you today?
          </p>
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden p-2 border rounded-lg hover:bg-gray-100"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Dropdown Menu (Mobile only) */}
        {menuOpen && (
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-lg w-48 p-3 border animate-slide-down z-10">
            <p className="text-gray-700 font-semibold text-sm mb-2">
              Hello {user?.email?.split("@")[0]} 👋
            </p>
            <div className="flex flex-col gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    send(prompt);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left text-sm px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {prompt}
                </button>
              ))}
              <button
                onClick={() => {
                  handleSignOut();
                  setMenuOpen(false);
                }}
                className="w-full text-left text-sm px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CHAT AREA */}
      <main className="w-full max-w-3xl flex flex-col flex-1 bg-white rounded-b-xl shadow-md p-4 mt-1">
        <ChatWindow messages={messages} loading={loading} />

        <form onSubmit={onSubmit} className="mt-2 flex gap-2">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
          >
            {loading ? "..." : "Send"}
          </button>
        </form>

        {/* Desktop Quick Prompts */}
        <div className="mt-3 hidden sm:flex gap-2 flex-wrap">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => send(prompt)}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
