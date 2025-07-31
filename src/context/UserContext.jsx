// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode") || "false")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Erreur session Supabase :", error.message);
        }
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("Erreur lors de la récupération de la session :", err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newVal));
      return newVal;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, darkMode, toggleDarkMode, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}