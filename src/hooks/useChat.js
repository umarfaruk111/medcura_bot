import { useState } from "react";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // ⚠️ Dev only
});

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I’m Medcura Bot, your friendly healthcare assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const send = async (query) => {
    console.log("📨 User sent:", query);

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setLoading(true);

    try {
      console.log("🔑 Loaded key:", import.meta.env.VITE_OPENAI_API_KEY);

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Medcura Bot, a helpful healthcare assistant. Provide safe and friendly advice." },
          ...messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ],
      });

      console.log("✅ OpenAI raw response:", response);

      const reply = response.choices[0].message.content.trim();
      console.log("🤖 Bot reply:", reply);

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("❌ OpenAI error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
}
