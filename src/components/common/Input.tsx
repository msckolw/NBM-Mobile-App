import { TextInput, View, Text, StyleSheet } from "react-native";

export default function Input({ label, error, ...props }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, error && styles.errorBorder]}
        placeholderTextColor="#999"
        {...props}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 6, color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  errorBorder: { borderColor: "red" },
  errorText: { color: "red", marginTop: 4, fontSize: 12 },
});
