"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subscription;

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(data ?? null);
        } else {
          setProfile(null);
        }
      } catch (e) {
        setUser(null);
        setProfile(null);
        setError(e?.message || "Auth error");
      } finally {
        setLoading(false);
      }
    }

    init();

    try {
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          if (session?.user) {
            try {
              const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();
              setProfile(data ?? null);
            } catch {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
        }
      );
      subscription = sub;
    } catch {
      subscription = { unsubscribe: () => {} };
    }

    return () => subscription?.unsubscribe?.();
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    role: profile?.role || null,
    isAdmin: profile?.role === "Admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
