import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const DonationSuccessScreen = ({navigation}: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.title}>Thank You!</Text>

        <Text style={styles.message}>
          Your donation has been received. Thank you for supporting
          independent journalism at NoBiasNews.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'Home',
            })
          }
          >
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  successIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#E5F7EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 48,
    color: '#16803D',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DonationSuccessScreen;