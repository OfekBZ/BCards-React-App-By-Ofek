// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API = "https://monkfish-app-z9uza.ondigitalocean.app/bcard2";

type UserType = {
  _id: string;
  name: { first: string; middle: string; last: string };
  email: string;
  image: { url: string; alt: string };
  isBusiness?: boolean;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const payload = { email: email.trim().toLowerCase(), password: password.trim() };
    try {
      const { data } = await axios.post<string | { token: string }>(`${API}/users/login`, payload);
      const jwt = typeof data === "string" ? data : data.token;
      localStorage.setItem("token", jwt);
      setToken(jwt);

      let u: UserType | null = null;

      try {
        const me = await axios.get<UserType>(`${API}/users/me`, {
          headers: { "x-auth-token": jwt, Authorization: `Bearer ${jwt}` },
        });
        u = me.data;
      } catch {
        const decoded = jwtDecode<Record<string, any>>(jwt);
        const uid =
          decoded._id || decoded.id || decoded.userId || decoded.user_id || decoded.sub;
        if (!uid) throw new Error("Could not extract user id from token");
        const res = await axios.get<UserType>(`${API}/users/${uid}`, {
          headers: { "x-auth-token": jwt, Authorization: `Bearer ${jwt}` },
        });
        u = res.data;
      }

      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
      navigate("/");
    } catch (err: any) {
      const msg =
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Invalid email or password";
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
