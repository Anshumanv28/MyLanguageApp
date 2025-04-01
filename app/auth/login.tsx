import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/home");
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Title
          title="Welcome Back!"
          titleStyle={[styles.title, { color: theme.colors.primary }]}
        />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="email-outline" />}
            disabled={loading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            left={<TextInput.Icon icon="lock-outline" />}
            disabled={loading}
          />
          {loading ? (
            <ActivityIndicator
              animating={true}
              color={theme.colors.primary}
              size="large"
              style={styles.loader}
            />
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              disabled={loading}
            >
              Login
            </Button>
          )}

          {/* Forgot Password Button */}
          <Text
            style={styles.forgotPasswordText}
            onPress={() => !loading && router.push("/auth/password_reset")}
          >
            Forgot Password?
          </Text>

          <Text
            style={styles.signUpText}
            onPress={() => !loading && router.push("/auth/register")}
          >
            Don't have an account?{" "}
            <Text style={styles.signUpLink}>Sign Up</Text>
          </Text>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 8,
  },
  loader: {
    marginVertical: 15,
    alignSelf: "center",
  },
  forgotPasswordText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    color: "#1E88E5",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  signUpLink: {
    color: "#1E88E5",
    fontWeight: "bold",
  },
});
