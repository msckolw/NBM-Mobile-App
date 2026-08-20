import React, { useState, useEffect } from "react";
import { getArticle } from "../../../api/news";




export const useDetailedNews = (id?: string) => {

    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(true)

// console.log("ArticleDataadw:", data)


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
            console.log("adpi idL", id)
            const res = await getArticle(id)
            if(res !== null)
            {
                // console.log("response from Api:", res)
                setData(res)
                // const sanitized = (res.articles || []).filter(Boolean);
                // setData(sanitized);
            }
        }catch(err)
        {
            console.log("Error from Api:", err)
            setError(err)
        }finally{
            setLoading(false)
        }
    }

    return {data, error, loading}
}