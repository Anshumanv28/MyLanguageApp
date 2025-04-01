import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../services/supabaseClient";

type AuthContextType = {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; // Add resetPassword function
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkUserSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
        await AsyncStorage.setItem("userToken", data.session.access_token);
        await fetchUserData(); // Fetch additional user data
      } else {
        setUser(null);
        await AsyncStorage.removeItem("userToken");
      }
      setLoading(false);
    };

    checkUserSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          await AsyncStorage.setItem("userToken", session.access_token);
          await fetchUserData(); // Fetch additional user data
        } else {
          setUser(null);
          await AsyncStorage.removeItem("userToken");
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch additional user data
  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      setUser((prevUser: any) => ({ ...prevUser, ...data })); // Merge additional data into user state
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) {
      setUser(data.session.user);
      await AsyncStorage.setItem("userToken", data.session.access_token);
      await fetchUserData(); // Fetch additional user data
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // Insert user data into the users table
    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email,
        name,
      });
      setUser(data.user);
    }
  };

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    await AsyncStorage.removeItem("userToken");
  };

  // Reset Password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://your-app-url.com/auth/update-password", // Replace with your app's URL
      });
      if (error) throw error;
      console.log("Password reset email sent successfully.");
    } catch (err) {
      console.error("Error sending password reset email:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchUserData,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
