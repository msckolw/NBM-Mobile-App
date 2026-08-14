import React,{useCallback} from "react";

import { Text,TouchableOpacity } from "react-native";

type NewsTopic = string;


interface TabItemProps {
    topic: NewsTopic;
    isActive: boolean;
    onPress: (topic: NewsTopic) => void;
    activeBackgroundColor: string;
    inactiveBackgroundColor: string;
    activeTextColor: string;
    inactiveTextColor: string;
  }

export const TabItem = ({
    topic,
    isActive,
    onPress,
    activeBackgroundColor,
    inactiveBackgroundColor,
    activeTextColor,
    inactiveTextColor,
  }: TabItemProps) => {
    const handlePress = () => {
      onPress(topic);
    }
  
    return (
      <TouchableOpacity
        style={[
        //   styles.tab,
          {
            backgroundColor: isActive ? activeBackgroundColor : inactiveBackgroundColor,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={`Filter news by ${topic} topic`}
      >
        <Text
          style={[
            // styles.tabText,
            {
              color: isActive ? activeTextColor : inactiveTextColor,
              fontWeight: isActive ? '600' : '500',
            },
          ]}
        >
          {topic}
        </Text>
      </TouchableOpacity>
    );
  };