import React, { useEffect, useRef } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NEWS_TOPICS } from '../../../data/topics';

export default function TopicTabs({
  onPress,
  selected,
  theme = 'light',
}: {
  onPress: (topic: string) => void;
  selected?: string;
  theme?: 'light' | 'dark';
}) {
  const listRef = useRef<FlatList<string>>(null);

  useEffect(() => {
    if (!selected) return;

    const index = NEWS_TOPICS.indexOf(selected);

    if (index === -1) return;

    // Wait until the list has rendered before scrolling.
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    });
  }, [selected]);

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        ref={listRef}
        data={NEWS_TOPICS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        getItemLayout={(_, index) => ({
          length: 90,
          offset: 90 * index,
          index,
        })}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          }, 100);
        }}
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
                  color: isActive
                    ? '#fff'
                    : theme === 'dark'
                    ? '#fff'
                    : '#000',
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