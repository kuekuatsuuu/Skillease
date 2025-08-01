"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        // If user exists but no profile, create one
        if (session?.user) {
          await ensureProfile(session.user);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session?.user) {
        await ensureProfile(session.user);
        toast.success("Welcome back!");
      } else if (event === "SIGNED_OUT") {
        toast.success("Signed out successfully!");
      }
      setLoading(false);
    });

    // Periodically check session validity (every 2 minutes)
    const interval = setInterval(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    }, 2 * 60 * 1000);

    return () => {
      subscription?.unsubscribe();
      clearInterval(interval);
    };
  }, []);
  // Helper: handle 401 errors in fetches and force logout
  const handleAuthFetchError = async (error) => {
    if (
      error &&
      (error.status === 401 || error.message?.includes("JWT expired"))
    ) {
      toast.error("Session expired. Please log in again.");
      await signOut();
      setUser(null);
      setLoading(false);
    }
  };

  // Ensure user has a profile in the profiles table
  const ensureProfile = async (user, additionalData = {}) => {
    if (!user) return;

    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching profile:", fetchError);
        return;
      }

      // If no profile exists, create one
      if (!existingProfile) {
        console.log("Creating new profile for user:", user.email);

        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            full_name:
              user.user_metadata?.full_name || additionalData.full_name || "",
            user_type:
              user.user_metadata?.user_type ||
              additionalData.user_type ||
              "customer",
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          console.log("Profile created successfully");
        }
      } else {
        console.log("Profile already exists");
      }
    } catch (error) {
      console.error("Error in ensureProfile:", error);
    }
  };

  // Sign up with email and password
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      console.log("Starting signup process...", { email, metadata });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || "",
            user_type: metadata.user_type || "customer",
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup successful:", data);

      // If user is confirmed immediately, create profile
      if (data.user && data.session) {
        await ensureProfile(data.user, metadata);
        toast.success("Account created successfully!");
      } else if (data.user && !data.session) {
        toast.success("Check your email for confirmation link!");
      }

      return data;
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    handleAuthFetchError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
