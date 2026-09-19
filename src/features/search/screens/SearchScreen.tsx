import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../../../context/ThemeContext';

const Search = () => {
  const {theme} = useTheme();

  const isDark = theme === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#000' : '#fff',
        },
      ]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5',
          },
        ]}>
        <Ionicons
          name="search-outline"
          size={34}
          color={isDark ? '#fff' : '#222'}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: isDark ? '#fff' : '#111',
          },
        ]}>
        Search is coming soon
      </Text>

      <Text
        style={[
          styles.message,
          {
            color: isDark ? '#aaa' : '#666',
          },
        ]}>
        Soon you'll be able to search and discover articles from across
        NoBiasNews.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },

  message: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 300,
  },
});

export default Search;