import React from "react";
import { View , Text, Alert} from "react-native";
import TopicTabs from "../../../components/news/TopicTabs";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";





const Search = ()=>{
    return (
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
              {/* <TopicTabs
    onPress={(topic) => 
      {ReactNativeHapticFeedback.trigger("impactLight");
        Alert.alert(`${topic} selected`)}}
  /> */}
            <Text 
            numberOfLines={2}
            style={{color:"#000"}}>
                Coming in a future update.
            </Text>
            </View>
    )
}


export default Search;