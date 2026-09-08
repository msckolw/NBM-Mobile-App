import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';

export default function SkeletonCard() {
  const {theme} = useTheme();

  const isDark = theme === 'dark';

  const skeletonColor = isDark ? '#2A2A2A' : '#E5E5E5';

  return (
    <View
      style={{
        marginBottom: 18,
        padding: 16,
        borderRadius: 16,
        backgroundColor: isDark ? '#1A1A1A' : '#fff',
      }}>
      
      {/* Image */}
      <View
        style={{
          width: '100%',
          height: 220,
          borderRadius: 14,
          backgroundColor: skeletonColor,
        }}
      />

      {/* Category */}
      <View
        style={{
          width: 80,
          height: 12,
          marginTop: 12,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />

      {/* Title */}
      <View
        style={{
          width: '90%',
          height: 20,
          marginTop: 10,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />

      <View
        style={{
          width: '70%',
          height: 20,
          marginTop: 6,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />

      {/* Summary */}
      <View
        style={{
          width: '95%',
          height: 14,
          marginTop: 10,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />

      <View
        style={{
          width: '85%',
          height: 14,
          marginTop: 6,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />

      {/* Date */}
      <View
        style={{
          width: 60,
          height: 12,
          marginTop: 12,
          borderRadius: 4,
          backgroundColor: skeletonColor,
        }}
      />
    </View>
  );
}