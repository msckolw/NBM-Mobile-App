import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';




type User = {
    id:string;
    name:string;
    email:string;
}


type useAuthState = {
    user:User | null;
    token:string | null;
    setAuth:(user:User,token:string) =>void;
    logout:() =>void;
}

// Safe AsyncStorage wrapper to handle initialization errors
let safeAsyncStorage: any = null;

// Lazy load AsyncStorage to prevent crashes if native module isn't available
const getAsyncStorage = () => {
    if (safeAsyncStorage) {
        return safeAsyncStorage;
    }
    
    try {
        // Dynamically import AsyncStorage
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        if (AsyncStorage) {
            safeAsyncStorage = AsyncStorage;
            return AsyncStorage;
        }
    } catch (error) {
        console.warn('AsyncStorage not available, using in-memory storage:', error);
    }
    
    // Fallback to in-memory storage
    const memoryStorage: { [key: string]: string } = {};
    safeAsyncStorage = {
        getItem: async (key: string) => memoryStorage[key] || null,
        setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
        removeItem: async (key: string) => { delete memoryStorage[key]; },
    };
    return safeAsyncStorage;
};

export const useAuthStore = create <useAuthState>()(
    persist(
        (set)=>({
            user: null,
            token:null,
            setAuth : (user,token) =>set({user,token}),
            logout : ()=>set({user:null,token:null})
        }),
        {
            name:"auth-storage",
            storage:createJSONStorage(()=>getAsyncStorage()),
            partialize:(state) => ({token: state.token, user: state.user}),
        }
    )
)


export default useAuthStore;