import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = async (email, password) => {
  const res = await axios.post("http://localhost:5000/api/auth/login", {
    email,
    password,
  });

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  setUser(res.data.user);

  return res.data.user; // ← IMPORTANT
};

 const signup = async (name, email, password, role) => {
  const res = await axios.post(
    "http://localhost:5000/api/auth/signup",
    { name, email, password, role }
  );

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user)); // 🔥 ADD THIS

  setUser(res.data.user);

  return res.data;
};



  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};