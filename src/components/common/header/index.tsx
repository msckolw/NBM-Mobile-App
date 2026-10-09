import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import {useTheme} from '../../../context/ThemeContext';
import {createHeaderStyles} from './styles';
import type {AppHeaderProps} from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AppHeader = ({
  variant = 'screen',
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
}: AppHeaderProps) => {
    const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {theme} = useTheme();
  const isDark = theme === 'dark';
  const styles = createHeaderStyles(isDark);
  const iconColor = isDark ? '#FFFFFF' : '#171717';

  return (
    <View
  style={[
    styles.container,
    {paddingTop: insets.top},
  ]}>
      {showBackButton && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBackPress}
          disabled={!onBackPress}
          hitSlop={8}
          style={({pressed}) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}>
          <Ionicons name="arrow-back" size={24} color={iconColor} />
        </Pressable>
      )}

      <View style={styles.titleContainer}>
        {variant === 'home' ? (
          <>
            <Text style={styles.brandTitle} numberOfLines={1}>
              THE NOBIAS MEDIA
            </Text>
            {/* <Text style={styles.brandSubtitle} numberOfLines={1}>
              News without the noise.
            </Text> */}
          </>
        ) : (
          <>
            {!!title && (
              <Text
                accessibilityRole="header"
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail">
                {title}
              </Text>
            )}

            {!!subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </>
        )}
      </View>

      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : null}
    </View>
  );
};

export default AppHeader;