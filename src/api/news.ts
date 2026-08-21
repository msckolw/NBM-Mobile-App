import api from "./client";

const url = "/news?category=all"


export const getNews = async (page = 1) =>{
      const res = await api.get(`/news?page=${page}`);
      return res.data;   // returns { articles: [], currentPage, totalPages }
    };
    

export const getNewsByCategory = async (cat: string) => {
  const res = await api.get(`/news?category=${cat}`);
  return res.data;
}

export const getNewsByCategoryPaged = async (cat: string, page: number = 1) => {
  try {
    const res = await api.get(`/category/${encodeURIComponent(cat)}?page=${page}`);
    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404 || status === 400) {
      const res = await api.get(`/news?category=${encodeURIComponent(cat)}&page=${page}`);
      return res.data;
    }
    throw error;
  }
}


export const getArticle = async (id: string, source: boolean = false) => {
  try {
    console.log("Getting ID here:", id)
    const res = await api.get(`/news/${id}?source=${source}`);
    return res?.data;
  } catch (error:any) {
    console.log("errorFrom Articles:", error)
    throw new Error(error.response?.data?.message || 'Failed to fetch article');
  }
};

export const readDetailedNews =async (more:any)=>{
    const res = await api.get(`/news?page=${more}`);
      return res.data; 
}


export const getSourceType = async () => {
  try {
    const response = await api.get(`/source`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sources');
  }
};