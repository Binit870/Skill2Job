import { createContext, useState } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const refreshUser = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const res = await api.get("/api/profile");
    const fullUser = res.data;

    sessionStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);
  };

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });

    const token = res.data.token;
    const basicUser = res.data.user;

    sessionStorage.setItem("token", token);

    // ✅ Fetch full profile so companyName, companyLogo, skills etc. are available
    const profileRes = await api.get("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fullUser = { ...basicUser, ...profileRes.data };

    sessionStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);

    return fullUser;
  };

  const signup = async (name, email, password, role) => {
    const res = await api.post("/api/auth/signup", { name, email, password, role });

    const token = res.data.token;
    const basicUser = res.data.user;

    sessionStorage.setItem("token", token);

    // ✅ Fetch full profile immediately after signup too
    const profileRes = await api.get("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fullUser = { ...basicUser, ...profileRes.data };

    sessionStorage.setItem("user", JSON.stringify(fullUser));
    setUser(fullUser);

    return { ...res.data, user: fullUser };
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, refreshUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};