import React from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAndroidBackHandler from '../../../hooks/useAndroidBackHandler';
import { useTheme } from '../../../context/ThemeContext';

const Settings = () => {
  useAndroidBackHandler();
  const navigation = useNavigation();

  const {theme, toggleTheme} = useTheme();


  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#000' : '#fff';
  const rowBackground = isDark ? '#1A1A1A' : '#F5F5F5';
  const textColor = isDark ? '#fff' : '#000';
  const secondaryColor = isDark ? '#aaa' : '#666';
  const iconColor = isDark ? '#fff' : '#222';

  const openWebView = (url: string, title: string) => {
    navigation.navigate('WebViewScreen' as never, {url, title} as never);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <View style={{ paddingHorizontal: 16 }}>
        {/* HEADER */}

        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: textColor,
            marginBottom: 20,
          }}
        >
          Settings
        </Text>

        {/* GENERAL */}

        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: secondaryColor,
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          GENERAL
        </Text>

        {/* DARK MODE */}

        <View
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name={isDark ? 'moon' : 'moon-outline'}
            size={22}
            color={iconColor}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 14,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: textColor,
              }}
            >
              Dark Mode
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: secondaryColor,
                marginTop: 2,
              }}
            >
              Use dark appearance
            </Text>
          </View>

          <Switch
  value={isDark}
  onValueChange={toggleTheme}
/>
        </View>

        {/* INFORMATION */}

        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: secondaryColor,
            marginTop: 20,
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          INFORMATION
        </Text>

        {/* PRIVACY POLICY */}

        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/privacy-policy',
              'Privacy Policy'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name="shield-checkmark-outline"
            size={22}
            color={iconColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
            }}
          >
            Privacy Policy
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>

        {/* TERMS */}

        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/terms-conditions',
              'Terms And Conditions'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name="document-text-outline"
            size={22}
            color={iconColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
            }}
          >
            Terms & Conditions
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>

        {/* ABOUT */}

        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/about',
              'About Us'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name="information-circle-outline"
            size={22}
            color={iconColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
            }}
          >
            About Us
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>

        {/* CONTACT */}

        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/contact',
              'Contact Us'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name="mail-outline"
            size={22}
            color={iconColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
            }}
          >
            Contact Us
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>


  {/* REFUND POLICY */}
        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/refund-policy',
              'Refund and Cancellation Policy'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 8,
          }}
        >
          <Icon
            name="cash-outline"
            size={22}
            color={iconColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
            }}
          >
            Refund Policy
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>

        {/* ACCOUNT */}

        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: secondaryColor,
            marginTop: 20,
            marginBottom: 8,
            marginLeft: 4,
          }}
        >
          ACCOUNT
        </Text>

        {/* DELETE ACCOUNT */}

        <TouchableOpacity
          onPress={() =>
            openWebView(
              'https://www.thenobiasmedia.com/delete-account',
              'Delete Account'
            )
          }
          style={{
            height: 56,
            borderRadius: 14,
            backgroundColor: rowBackground,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
          }}
        >
          <Icon
            name="trash-outline"
            size={22}
            color={secondaryColor}
          />

          <Text
            style={{
              flex: 1,
              marginLeft: 14,
              fontSize: 16,
              fontWeight: '600',
              color: secondaryColor,
            }}
          >
            Delete Account
          </Text>

          <Icon
            name="chevron-forward"
            size={20}
            color={secondaryColor}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;