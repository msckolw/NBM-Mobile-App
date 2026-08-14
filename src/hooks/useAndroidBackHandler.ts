import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const useAndroidBackHandler = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }

        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );
};

export default useAndroidBackHandler;