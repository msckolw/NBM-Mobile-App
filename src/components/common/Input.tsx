import {TextInput, View, Text, StyleSheet, TextInputProps} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

type InputProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function Input({label, error, ...props}: InputProps) {
  const {theme} = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {color: isDark ? '#fff' : '#111'},
        ]}>
        {label}
      </Text>

      <TextInput
        {...props}
        placeholderTextColor={isDark ? '#888' : '#999'}
        style={[
          styles.input,
          {
            color: isDark ? '#fff' : '#111',
            backgroundColor: isDark ? '#1c1c1c' : '#fff',
            borderColor: error
              ? '#dc2626'
              : isDark
              ? '#444'
              : '#ccc',
          },
        ]}
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },

  errorText: {
    color: '#dc2626',
    marginTop: 4,
    fontSize: 12,
  },
});