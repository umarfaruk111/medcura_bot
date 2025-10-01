import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Hardcoded credentials
  const hardcodedEmail = "farouk@gmail.com";
  const hardcodedPassword = "muhammad";

  const signIn = (email, password) => {
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setUser({ email });
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const signUp = (fullName, email, password) => {
    if (email && password && fullName) {
      // For now, just check against the hardcoded
      if (email === hardcodedEmail && password === hardcodedPassword) {
        setUser({ email, fullName });
        return { success: true };
      } else {
        return { success: false, message: "Use correct credentials (farouk@gmail.com / muhammad)" };
      }
    }
    return { success: false, message: "All fields are required" };
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
