import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NEWS_TOPICS } from '../../data/topics';
// import { useThemeStyles } from "../../theme/useThemeStyles";

export default function TopicTabs({
  onPress,
  selected,
}: {
  onPress: (topic: string) => void;
  selected?: string;
}) {
  //   const { colors } = useThemeStyles();

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={NEWS_TOPICS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({ item }) => {
          const isActive = selected === item;
          return (
            <Pressable
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 16,
                marginRight: 8,
                backgroundColor: isActive ? '#1D3C75' : 'transparent',
              }}
              onPress={() => onPress(item)}
            >
              <Text
                style={{
                  color: isActive ? '#fff' : '#000',
                  fontWeight: '600',
                }}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
