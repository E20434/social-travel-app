import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("travelUser");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveAuth = (data) => {
    setAuth(data);
    localStorage.setItem("travelUser", JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("travelUser");
  };

  const refreshUser = async () => {
    if (!auth?.token) return;
    try {
      setLoading(true);
      const { data } = await api.get("/auth/me");
      saveAuth({ ...auth, user: data });
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth: saveAuth,
        logout,
        loading,
        isAuthenticated: !!auth?.token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);