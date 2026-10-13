import React from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

type AuthRequiredModalProps = {
  visible: boolean;
  onClose: () => void;
  onGoogleLogin: () => void;
  loading?: boolean;
};

export default function AuthRequiredModal({
  visible,
  onClose,
  onGoogleLogin,
  loading = false,
}: AuthRequiredModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={event => event.stopPropagation()}
          style={{
            width: '85%',
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            Sign in to bookmark
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Sign in with Google to save articles to your bookmarks.
          </Text>

          <Pressable
            onPress={onGoogleLogin}
            disabled={loading}
            style={{
              backgroundColor: '#1D3C75',
              paddingVertical: 14,
              borderRadius: 999,
              alignItems: 'center',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Continue with Google
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={onClose}
            disabled={loading}
            style={{
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#555',
                fontSize: 15,
              }}
            >
              Not now
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },

  icon: {
    fontSize: 32,
    marginBottom: 12,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },

  googleButton: {
    width: '100%',
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },

  googleButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 14,
    paddingVertical: 10,
  },

  cancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
});