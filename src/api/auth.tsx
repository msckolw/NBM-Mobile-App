import api from "./client";



export const loginApi = async(email:string, password:string)=>{
    const res = api.post("/auth/login", {email, password})
    console.log("LoginRes:", res)
    return res
}

export const RegisterApi = async(payload:{
    name:string,
    email:string,
    password:string
})=>{
    const res = api.post('',{payload})
    return res
}