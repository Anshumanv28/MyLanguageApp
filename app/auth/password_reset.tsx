import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
} from "react-native-paper";
import { useAuth } from "../../contexts/AuthContext";

export default function PasswordResetScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert("Success", "Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Reset Password" titleStyle={styles.title} />
        <Card.Content>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
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
              onPress={handlePasswordReset}
              style={styles.button}
              disabled={loading}
            >
              Send Reset Email
            </Button>
          )}
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
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
