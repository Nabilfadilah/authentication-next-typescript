"use client";

import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import api from "../lib/api";
import {AuthContextType, User, LoginData} from "../types/Auth";

// buat context autentikasi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// tipe props untuk komponen AuthProvider, harus menerima children
interface AuthProviderProps {
  children: ReactNode;
}

// provider untuk membungkus komponen agar bisa mengakses context
export const AuthProvider = ({children}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // state menyimpan user yang login
  const [token, setToken] = useState<string | null>(null); // state menyimpan token
  const [loading, setLoading] = useState<boolean>(true); // state untuk loading

  // saat pertama kali komponen dimount (load), ambil token dan user dari localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // jika ada token dan user di localStorage, simpan ke state
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser)); // ubah dari string ke objek
      } catch {
        // jika gagal parsing, set user ke null
        setUser(null);
      }
    }

    setLoading(false); // selesaikan loading
  }, []);

  // fungsi login, mengirim email dan password ke API
  const login = async ({email, password}: LoginData) => {
    try {
      const res = await api.post("/login", {email, password}); // kirim data login ke endpoint /login
      const {token, user} = res.data; // ambil token dan user dari response

      // simpan token dan user ke localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // simpan ke state
      setToken(token);
      setUser(user);
    } catch (error) {
      // jika error
      throw new Error("Login failed");
    }
  };

  // fungsi logout, hapus semua data autentikasi
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // provider dengan value yang bisa digunakan oleh komponen anak
  return (
    <AuthContext.Provider value={{user, token, login, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook, agar lebih mudah mengakses context dari komponen lain
export const useAuth = () => {
  const context = useContext(AuthContext); // ambil context

  // jika context undefined (belum dibungkus AuthProvider), lempar error
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
