import useAuthStore from "../store/AuthStore";
import axios from "axios";



const baseURL = "https://nobiasmedia.onrender.com/api";
const timeOut = 10000;

const api = axios.create({
    baseURL : baseURL,
    timeout : timeOut
})


api.interceptors.request.use(async (config)=>{

    const token = useAuthStore.getState().token;
    if(token)
    {
        config.headers.Authorization = `Bearer ${token}` 
    }
    // attach token here;
    return config;
})


api.interceptors.response.use(async (response)=> response,
    (error) =>{
        console.log("API Error :", error?.response?.data);
        return (Promise.reject(error))
    }
)


export default api;