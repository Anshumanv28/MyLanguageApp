import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";
import { Button, Avatar, Card } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { WebView } from "react-native-webview";

const HomeScreen = () => {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [wordOfTheDay, setWordOfTheDay] = useState("Irula");
  const [youtubeVideos, setYoutubeVideos] = useState([
    "https://www.youtube.com/embed/xcZp1SrQjZY",
  ]);

  console.log("🍿🍿🍿🍿🍿🍿User❤️❤️❤️❤️❤️❤️: ", user);
  useEffect(() => {
    const fetchUserScore = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("score")
          .eq("id", user?.id)
          .single();

        if (error) {
          console.error("Error fetching user score:", error.message);
        } else {
          setScore(data?.score || 0);
        }
      } catch (err) {
        console.error("Error fetching user score:", err);
      }
    };

    if (user?.id) {
      fetchUserScore();
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <Avatar.Image
          size={64}
          source={
            user?.photoURL
              ? { uri: user.photoURL }
              : require("../assets/images/Monkey-Selfie.webp")
          }
        />
        <View style={styles.greetingText}>
          <Text style={styles.greetingTitle}>
            Welcome Back, {user?.name || "Learner"} 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Email: {user?.email || "N/A"}
          </Text>
          <Text style={styles.greetingSubtitle}>Score: {score}</Text>
        </View>
      </View>

      {/* Word of the Day Section */}
      <Card style={styles.section}>
        <Card.Title title="Word of the Day" />
        <Card.Content>
          <Text style={styles.sectionContent}>{wordOfTheDay}</Text>
        </Card.Content>
      </Card>

      {/* YouTube Videos Section */}
      <Card style={styles.section}>
        <Card.Title title="Explore Irula Culture" />
        <Card.Content>
          {youtubeVideos.map((videoUrl, index) => (
            <View key={index} style={styles.videoContainer}>
              <WebView
                source={{ uri: videoUrl }}
                style={styles.video}
                javaScriptEnabled={true}
                domStorageEnabled={true}
              />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Profile Button */}
      <View style={styles.profileButtonContainer}>
        <Button mode="contained" onPress={() => console.log("View Profile")}>
          View Profile
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  greetingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingText: {
    marginLeft: 12,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  greetingSubtitle: {
    color: "#888",
    fontSize: 14,
  },
  section: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  sectionContent: {
    fontSize: 16,
    marginTop: 8,
  },
  videoContainer: {
    marginTop: 10,
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  video: {
    flex: 1,
  },
  profileButtonContainer: {
    marginTop: 16,
  },
});

export default HomeScreen;
