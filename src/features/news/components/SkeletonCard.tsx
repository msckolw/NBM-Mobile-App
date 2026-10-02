import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../../context/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SkeletonBlock = ({
  width,
  height,
  marginTop = 0,
  borderRadius = 6,
  color,
}: {
  width: number | `${number}%`;
  height: number;
  marginTop?: number;
  borderRadius?: number;
  color: string;
}) => {
  return (
    <View
      style={{
        width,
        height,
        marginTop,
        borderRadius,
        backgroundColor: color,
      }}
    />
  );
};

export default function SkeletonCard() {
  const {theme} = useTheme();

  const isDark = theme === 'dark';

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const skeletonColor = isDark ? '#222222' : '#E9E9E9';

  const shimmerColor = isDark ? '#303030' : '#F7F7F7';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#111111' : '#FFFFFF',
        },
      ]}>
      {/* Skeleton content */}
      <View style={StyleSheet.absoluteFill}>
        <SkeletonBlock
          width="100%"
          height={220}
          borderRadius={14}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="20%"
          height={12}
          marginTop={12}
          borderRadius={6}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="90%"
          height={20}
          marginTop={10}
          borderRadius={6}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="70%"
          height={20}
          marginTop={6}
          borderRadius={6}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="95%"
          height={14}
          marginTop={12}
          borderRadius={6}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="85%"
          height={14}
          marginTop={6}
          borderRadius={6}
          color={skeletonColor}
        />

        <SkeletonBlock
          width="18%"
          height={12}
          marginTop={12}
          borderRadius={6}
          color={skeletonColor}
        />
      </View>

      {/* Single soft shimmer */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            backgroundColor: shimmerColor,
            transform: [
              {
                translateX,
              },
              {
                skewX: '-18deg',
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 350,
  },

  shimmer: {
    position: 'absolute',
    top: -40,
    bottom: -40,
    width: 90,
    opacity: 0.45,
  },
});