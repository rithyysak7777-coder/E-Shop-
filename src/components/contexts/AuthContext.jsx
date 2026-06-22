import { useState } from "react";
import { AuthContext } from "./AuthContextValue";

export const AuthProvider = ({ children }) => {
    // refresh page and store old data
    const [user, setUser] = useState(()=> {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
    });
const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    }); 

    const HandleLogin = (user,token)=>{
        localStorage.setItem("user",JSON.stringify(user));
        setUser(user)
        
        localStorage.setItem("token",token);
        setToken(token);
    }

    const HandleLogout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token")
        setUser(null);
        setToken(null);
    }
    return (
        <AuthContext.Provider value={{
            user,
            token,
            HandleLogin,
            HandleLogout
            }}>

            {children}
        </AuthContext.Provider>
    )
}
