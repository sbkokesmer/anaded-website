import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Temsili kullanıcı - Supabase entegrasyonunda burası değişecek
const DEMO_USER = {
  email: "uye@anaded.com",
  password: "anaded2021",
  name: "Ahmet Yılmaz",
  memberId: "ANADED-1042",
  phone: "+90 532 000 00 00",
  joinDate: "15 Ocak 2023",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // TODO: Supabase auth ile değiştirilecek
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const { password: _, ...userData } = DEMO_USER;
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: "E-posta veya şifre hatalı." };
  };

  const logout = () => {
    // TODO: Supabase signOut ile değiştirilecek
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
