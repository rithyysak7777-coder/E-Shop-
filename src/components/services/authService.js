import { api } from "../api/axios"

export const LoginAccount = async (data)=>{
    return await api.post("/auth/login",data)
}

export const RegisterAccount = async (data)=>{
    return await api.post("/auth/register",data);
}

// export const getProfile = async ()=>{
//     await api.get("/user/profile",{
//         headers:{
//             Authorization:${token}
//         }
//     });
// }