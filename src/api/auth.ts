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

export const googleSignIn = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const response = await api.post('/authArticleGetting/googleSignIn', {
    email,
    name,
  });

  return response.data;
};