import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // 👈 Added name state
  const [loading, setLoading] = useState(false); // 👈 Loading state
  const [error, setError] = useState(""); // 👈 Added error state

  const handleRegister = async () => {
    setLoading(true); // Start loading
    try {
      await register(email, password, name); // 👈 Pass name to register
      Alert.alert("Success", "Account created! Redirecting to home...");
      router.replace("/home"); // 👈 Redirect to home page after signup
    } catch (error: any) {
      setError(error.message); // 👈 Set error message
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Create Account" titleStyle={styles.title} />
        <Card.Content>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            label="Name" // 👈 Added Name input
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />
          {loading ? (
            <ActivityIndicator
              animating={true}
              color="#1E88E5"
              size="large"
              style={styles.loader}
            />
          ) : (
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.button}
              disabled={loading}
            >
              Sign Up
            </Button>
          )}
          <Text
            style={styles.signInText}
            onPress={() => !loading && router.push("/auth/login")}
          >
            Already have an account?{" "}
            <Text style={styles.signInLink}>Log In</Text>
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  },
  loader: {
    marginVertical: 15,
    alignSelf: "center",
  },
  signInText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  signInLink: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center", // 👈 Added error style
  },
});
