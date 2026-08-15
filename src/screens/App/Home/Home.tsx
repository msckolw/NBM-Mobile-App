import React,{useEffect, useState} from "react";
import { View , Text, ActivityIndicator, FlatList, Alert} from "react-native";
import { getNews } from "../../../api/news";
import NewsCard from "../../../components/news/NewsCard";
import SkeletonCard from "../../../components/news/SkeletonCard";
import { useBookmarkStore } from "../../../store/BookmarkStore";
import { useThemeStore } from "../../../store/ThemeStore";
import TopicTabs from "../../../components/news/TopicTabs";
import { useNavigation } from "@react-navigation/native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

// Safe NetInfo import
const getNetInfo = () => {
  try {
    return require("@react-native-community/netinfo").default;
  } catch (error) {
    console.warn("NetInfo not available");
    return {
      addEventListener: (callback: any) => {
        callback({ isConnected: true });
        return () => {};
      },
      fetch: async () => ({ isConnected: true }),
    };
  }
};


const Home = ()=>{

  const navigation = useNavigation();


    // const [news, setNews] = useState([]);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("All");


    console.log("isOffline", isOffline)

    console.log("NewsFromnbackend", articles)



    useEffect(()=>{
        fetchNews()
    }, [])


useEffect(() => {
    const NetInfo = getNetInfo();
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsOffline(!state.isConnected);
    });
  
    return () => unsubscribe();
  }, []);

    const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
    const theme = useThemeStore((s:any) => s.theme);

    console.log("themetoggle:", theme)

    const safeArticles = (articles || []).filter(
        (item) => item && item?._id
      );
      


    const fetchNews = async () => {
        try {
          const res = await getNews(page);
          const sanitized = (res.articles || []).filter(Boolean);
          setArticles(sanitized);
        } catch (error) {
          console.log("Error fetching News", error);
        } finally {
          setLoading(false);
        }
      };
      



    const onRefresh = async () =>{
        setRefreshing(true)
        setPage(1)

        try{
            const res= await getNews(1)
            setArticles(res.articles || [])
        }catch(err)
        {
            console.log(err)
        }
        ReactNativeHapticFeedback.trigger("impactLight")
        setRefreshing(false);
    }

    const loadMore = ()=>{
        console.log("loadingMore")
        if(page < totalPages)
        {
            setPage((prev )=> prev + 1) 
        }
    }


    if(loading && page === 1 )
    {
        return (
            <View style={{flex:1,justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator size = "large" />
                {/* {[1,2,3,4,5].map((_, i)=>(
                    <SkeletonCard key = {i}/>
                ))} */}
            </View>
        )
    }
    
    {isOffline && (
        <View style={{ padding: 6, backgroundColor: "#ffcc00" }}>
          <Text style={{ color: "#000" }}>You're offline — showing saved news</Text>
        </View>
      )}
      


    const renderItem = (item:any)=> {
        console.log("ItemId:", item?.item?._id)
        return (
            <NewsCard 
            article = {item} 
            origin="Home"
            title = "Read More"
            secondaryTitle="News Sources"
            theme={theme} 
            onPress={()=>navigation.navigate('ReadMore',{id:item?.item?._id, origin:"ReadMore"})}
            onSecondaryPress={() => navigation.navigate('Sources', { id: item?.item?._id })}
            />
        )
    }



// toggleBookmark(articles);

    return (
      <View style={{ flex: 1, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
  
  {/* Header must NOT use flex */}
  <TopicTabs
    selected={selectedTopic}
    onPress={(topic) => {
      ReactNativeHapticFeedback.trigger("impactLight");
      setSelectedTopic(topic);
      if (topic === "All") {
        return;
      }
      navigation.navigate('CategoryFeed', { topic });
    }}
  />

  <FlatList
    showsVerticalScrollIndicator={false}
    data={safeArticles.filter(item => item)}
    keyExtractor={(item) => item?._id.toString()}
    renderItem={renderItem}
    onEndReached={loadMore}
    onRefresh={onRefresh}
    refreshing={refreshing}
  />

</View>

    )
}


export default Home;