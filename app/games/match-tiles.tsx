import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MatchTilesGame() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match the Tiles Game</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
