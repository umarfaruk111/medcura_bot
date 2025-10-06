import { useState, useRef, useEffect } from "react";

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I’m Medcura Bot, your friendly healthcare assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async (query) => {
    if (!query.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setLoading(true);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // or gpt-4
          messages: [
            { role: "system", content: "You are Medcura Bot, a helpful healthcare assistant." },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: query }
          ]
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "⚠️ Sorry, I couldn’t connect. Try again later.";

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err) {
      console.error("OpenRouter error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I couldn’t connect. Try again later.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
}
