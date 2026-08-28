import api from "./client";



export const loginApi = async(email:string, password:string)=>{
    const res = await api.post("/auth/login", {email, password})
    console.log("LoginRes:", res)
    return res
}

export const registerApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/register", payload);

  return res;
};