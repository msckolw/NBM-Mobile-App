import React from "react";
import { View , Text, Alert} from "react-native";
import TopicTabs from "../../news/components/TopicTabs";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { useTheme } from "../../../context/ThemeContext";





const Search = ()=>{
    const {theme} = useTheme();

    const isDark = theme === 'dark';
    return (
        <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#000' : '#fff',
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            color: isDark ? '#fff' : '#000',
          }}
        >
          Coming in a future update.
        </Text>
      </View>
    )
}


export default Search;