import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IrulaLanguage App</Text>
      <Text style={styles.subtitle}>
        Learn the endangered Irular language through engaging activities.
      </Text>

      {/* <Image
        // source={require("assets/images/react-icon.png")} // Replace with actual image
        style={styles.image}
        resizeMode="contain"
      /> */}

      <Button
        mode="contained"
        onPress={() => router.push("/auth/register")}
        style={styles.signupButton}
      >
        Sign up
      </Button>
      <Button
        mode="contained"
        onPress={() => router.push("/auth/login")}
        style={styles.signupButton}
      >
        Log In
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  signupButton: {
    width: "80%",
    backgroundColor: "#B22222",
    paddingVertical: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
