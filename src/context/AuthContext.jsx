import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Oturum açan kullanıcının admin olup olmadığını veritabanından kontrol et
  const checkAdmin = async () => {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.error("[Auth] is_admin kontrolü başarısız:", error.message);
      setIsAdmin(false);
      return;
    }
    setIsAdmin(Boolean(data));
  };

  useEffect(() => {
    // Sayfa açıldığında mevcut oturumu yükle
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) await checkAdmin();
      setLoading(false);
    });

    // Oturum değişikliklerini dinle (giriş/çıkış)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdmin();
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("[Auth] giriş hatası:", error);
      return {
        success: false,
        error:
          error.message === "Invalid login credentials"
            ? "E-posta veya şifre hatalı."
            : `Giriş hatası: ${error.message}`,
      };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
