import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, Button } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Avatar.Text
        size={80}
        label={user?.email?.charAt(0).toUpperCase() || "U"}
        style={styles.avatar}
      />
      <Text variant="headlineLarge" style={styles.username}>
        {user?.email || "Guest"}
      </Text>
      <Button mode="contained" onPress={logout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E3F2FD",
  },
  avatar: {
    backgroundColor: "#1E88E5",
  },
  username: {
    marginTop: 10,
    fontSize: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
});
