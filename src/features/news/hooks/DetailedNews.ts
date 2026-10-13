import React, { useState, useEffect } from "react";
import { getArticle } from "../../../api/news";
import { devLog } from "../../../utils/devLog";





export const useDetailedNews = (id?: string) => {

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(true)

// devLog("ArticleDataadw:", data)


    useEffect(()=>{
        if (!id) {
            setLoading(false)
            return
        }
        fetchDetailedNews(id)
    }, [id])



    const fetchDetailedNews = async (id: string) => {
        try{
            setLoading(true)
            setError(null)
            devLog("adpi idL", id)
            const res = await getArticle(id)
            if(res !== null)
            {
                // devLog("response from Api:", res)
                setData(res)
                // const sanitized = (res.articles || []).filter(Boolean);
                // setData(sanitized);
            }
        }catch(err)
        {
            devLog("Error from Api:", err)
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    return {data, error, loading}
}