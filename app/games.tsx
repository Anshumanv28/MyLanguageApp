import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Games Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
