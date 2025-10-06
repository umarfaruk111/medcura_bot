import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Load chat history on mount
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Error loading chats:", error);
        return;
      }

      if (data.length > 0) {
        setMessages(
          data.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } else {
        setMessages([
          {
            sender: "bot",
            text: "👋 Hello! I’m Medcura Bot, your friendly healthcare assistant. How can I help you today?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    };

    fetchChats();

    // 🧩 Real-time listener (for bot + user)
    const channel = supabase
      .channel("realtime:chats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const msg = payload.new;
          setMessages((prev) => [
            ...prev,
            {
              sender: msg.sender,
              text: msg.message,
              time: new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // ✉️ Send and instantly show messages
  const send = async (query) => {
    if (!query.trim() || !user) return;

    const newUserMessage = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Show user message instantly
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    // Save user message to Supabase
    await supabase.from("chats").insert([
      {
        user_id: user.id,
        message: query,
        sender: "user",
      },
    ]);

    try {
      // 🧩 Prepare fresh conversation context (include latest messages)
      const { data: chatHistory } = await supabase
        .from("chats")
        .select("message, sender")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const formattedHistory = chatHistory.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.message,
      }));

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are Medcura Bot, a helpful healthcare assistant." },
            ...formattedHistory,
          ],
        }),
      });

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "⚠️ Sorry, I couldn’t connect. Try again later.";

      const botMessage = {
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // ✅ Instantly show bot reply (don’t wait for reload)
      setMessages((prev) => [...prev, botMessage]);

      // Save to Supabase
      await supabase.from("chats").insert([
        {
          user_id: user.id,
          message: reply,
          sender: "bot",
        },
      ]);
    } catch (err) {
      console.error("❌ OpenRouter error:", err);
      const fallback = {
        sender: "bot",
        text: "⚠️ Sorry, I couldn’t connect. Try again later.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallback]);

      await supabase.from("chats").insert([
        {
          user_id: user.id,
          message: fallback.text,
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
}
