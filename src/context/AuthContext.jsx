import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check session when app loads
  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error.message);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // ✅ Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // ✅ Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  // ✅ Sign Up (email + password + full name metadata)
  const signUp = async (fullName, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        console.error("SignUp error:", error.message);
        return { success: false, message: error.message };
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error("Unexpected SignUp error:", err);
      return { success: false, message: "Unexpected signup error occurred" };
    }
  };

  // ✅ Sign In
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignIn error:", error.message);
        return { success: false, message: error.message };
      }

      return { success: true, user: data.user };
    } catch (err) {
      console.error("Unexpected SignIn error:", err);
      return { success: false, message: "Unexpected signin error occurred" };
    }
  };

  // ✅ Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = { user, signUp, signIn, signOut };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-600">
        <img
          src="/logo.png"
          alt="Medcura Bot Logo"
          className="w-20 h-20 mb-4 animate-pulse"
        />
        <p className="text-lg font-medium">Loading Medcura Bot...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
