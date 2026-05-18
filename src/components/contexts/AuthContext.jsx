import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState();
    const [token,setToken] = useState(null);

    const HandleLogin = (user,token)=>{
        localStorage.setItem("user",JSON.stringify(user));
        setUser(user)
        
        localStorage.setItem("token",JSON.stringify(token));
        setToken(token);
    }

    const HandleLogout = ()=>{
        localStorage.removeItem("user");
        localStorage.removeItem("token")
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