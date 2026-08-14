import React from "react";
import { View, Pressable } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function HeaderButtons() {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: "row", gap: 16, paddingRight: 12 }}>
      {/* Home Icon */}
      <Pressable onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={26} color="#000" />
      </Pressable>

      {/* Settings Icon */}
      <Pressable onPress={() => navigation.navigate("Settings")}>
        <Ionicons name="settings-outline" size={26} color="#000" />
      </Pressable>
    </View>
  );
}
