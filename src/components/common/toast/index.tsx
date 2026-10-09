
import React from 'react';
import {Text, View} from 'react-native';

import {useTheme} from '../../../context/ThemeContext';
import {createToastStyles} from '../toast/styles';

export type AppToastProps = {
  text1?: string;
  text2?: string;
};

type AppToastVariant = 'success' | 'error' | 'info';

type Props = AppToastProps & {
  variant: AppToastVariant;
};

const ACCENT_COLORS: Record<AppToastVariant, string> = {
  success: '#22C55E',
  error: '#EF4444',
  info: '#3B82F6',
};

const AppToast = ({variant, text1, text2}: Props) => {
  const {theme} = useTheme();
  const isDarkMode = theme === 'dark';
  const styles = createToastStyles(isDarkMode);

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {borderLeftColor: ACCENT_COLORS[variant]},
      ]}>
      <View style={styles.textContainer}>
        {!!text1 && <Text style={styles.title}>{text1}</Text>}
        {!!text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  );
};

export default AppToast;
