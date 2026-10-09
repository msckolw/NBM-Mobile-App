
import {StyleSheet} from 'react-native';

export const createToastStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      width: '92%',
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderLeftWidth: 4,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      borderColor: isDarkMode ? '#333333' : '#EAEAEA',
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: isDarkMode ? 0.25 : 0.12,
      shadowRadius: 6,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: isDarkMode ? '#FFFFFF' : '#171717',
      fontSize: 15,
      fontWeight: '600',
    },
    message: {
      color: isDarkMode ? '#BDBDBD' : '#666666',
      fontSize: 13,
      lineHeight: 18,
      marginTop: 4,
    },
  });
