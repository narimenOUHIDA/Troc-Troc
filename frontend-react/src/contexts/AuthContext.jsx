import { createContext, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) { //children représente les composants qui auront accès au contexte.
    const queryClient = useQueryClient();

    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const { data: user, isPending } = useQuery({
        queryKey: ["profile"],
        queryFn: authUser,
        enabled: !!token, //empêche la requête lorsqu'aucun token n'est présent
        retry: false,
    });

    const login = (result) => {
        localStorage.setItem("token", result.token)
        setToken(result.token);

    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");

        queryClient.cancelQueries({ queryKey: ["profile"] });
        queryClient.setQueryData(["profile"], null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isPending, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}