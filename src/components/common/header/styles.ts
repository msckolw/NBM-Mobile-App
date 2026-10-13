import {StyleSheet} from 'react-native';

export const createHeaderStyles = (isDark: boolean) =>
  StyleSheet.create({
  
container: {
  minHeight: 64,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 8,
  backgroundColor: isDark ? '#121212' : '#FFFFFF',
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: isDark ? '#2A2A2A' : '#EAEAEA',
},

title: {
  fontSize: 22,
  lineHeight: 28,
  fontWeight: '700',
  color: isDark ? '#FFFFFF' : '#171717',
},


    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderRadius: 22,
    },

    pressed: {
      opacity: 0.65,
    },

    titleContainer: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'center',
    },

    // title: {
    //   fontSize: 18,
    //   lineHeight: 24,
    //   fontWeight: '700',
    //   color: isDark ? '#FFFFFF' : '#171717',
    // },

    subtitle: {
      marginTop: 2,
      fontSize: 12,
      lineHeight: 16,
      color: isDark ? '#AAAAAA' : '#666666',
    },

    brandTitle: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '800',
      letterSpacing: 0.4,
      color: isDark ? '#FFFFFF' : '#171717',
    },

    brandSubtitle: {
      marginTop: 2,
      fontSize: 11,
      lineHeight: 15,
      color: isDark ? '#AAAAAA' : '#666666',
    },

    rightAction: {
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 8,
    },
  });