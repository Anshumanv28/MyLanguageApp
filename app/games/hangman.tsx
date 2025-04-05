import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useFetchWords } from "../../hooks/useFetchWords";
import { WordModel } from "../../models/WordModel"; // Import WordModel

export default function HangmanGame() {
  const { words, loading, error } = useFetchWords(); // Fetch words dynamically
  const [word, setWord] = useState<string>(""); // The word to guess
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]); // Letters guessed by the user
  const [wrongGuesses, setWrongGuesses] = useState(0); // Count of wrong guesses

  const maxWrongGuesses = 6;

  const hangmanImages = [
    require("../../assets/hangman0.png"), // Gallows only
    require("../../assets/hangman1.png"), // Head
    require("../../assets/hangman2.png"), // Head + Body
    require("../../assets/hangman3.png"), // Head + Body + 1 Arm
    require("../../assets/hangman4.png"), // Head + Body + 2 Arms
    require("../../assets/hangman5.png"), // Head + Body + 2 Arms + 1 Leg
    require("../../assets/hangman6.png"), // Full Hangman
  ];

  // Select a random word when the words array changes
  useEffect(() => {
    if (words.length > 0) {
      const randomWord: string =
        words[Math.floor(Math.random() * words.length)].enWord.toUpperCase();
      setWord(randomWord);
      console.log("Selected random word:", randomWord); // Debug log
    }
  }, [words]);

  // Handle a guessed letter
  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter)) {
      Alert.alert("Already guessed", `You already guessed "${letter}"`);
      return;
    }

    setGuessedLetters((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  // Render the word with guessed letters and underscores
  const renderWord = () => {
    return word.split("").map((letter, index) =>
      guessedLetters.includes(letter) ? (
        <Text key={index} style={styles.letter}>
          {letter}
        </Text>
      ) : (
        <Text key={index} style={styles.letter}>
          _
        </Text>
      )
    );
  };

  // Render the alphabet for guessing
  const renderAlphabet = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet.map((letter) => (
      <TouchableOpacity
        key={letter}
        style={styles.letterButton}
        onPress={() => handleGuess(letter)}
      >
        <Text style={styles.letterButtonText}>{letter}</Text>
      </TouchableOpacity>
    ));
  };

  // Check if the game is over
  const checkGameOver = () => {
    if (wrongGuesses >= maxWrongGuesses) {
      Alert.alert("Game Over", `You lost! The word was "${word}".`, [
        { text: "Play Again", onPress: resetGame },
      ]);
    } else if (
      word.split("").every((letter) => guessedLetters.includes(letter))
    ) {
      Alert.alert("Congratulations", "You guessed the word!", [
        { text: "Play Again", onPress: resetGame },
      ]);
    }
  };

  // Reset the game
  const resetGame = () => {
    if (words.length > 0) {
      const randomWord: string =
        words[Math.floor(Math.random() * words.length)].enWord.toUpperCase();
      setWord(randomWord);
      console.log("Reset game with new word:", randomWord); // Debug log
    }
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  // Check game over conditions whenever guessed letters or wrong guesses change
  useEffect(() => {
    if (word) {
      checkGameOver();
    }
  }, [guessedLetters, wrongGuesses]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading words...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangman Game</Text>
      <Image source={hangmanImages[wrongGuesses]} style={styles.hangmanImage} />
      <Text style={styles.word}>{renderWord()}</Text>
      <Text style={styles.wrongGuesses}>
        Wrong Guesses: {wrongGuesses}/{maxWrongGuesses}
      </Text>
      <View style={styles.alphabetContainer}>{renderAlphabet()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  hangmanImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  word: {
    flexDirection: "row",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 5,
  },
  letter: {
    fontSize: 32,
    marginHorizontal: 5,
    fontWeight: "bold",
    color: "#333",
  },
  wrongGuesses: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
  alphabetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterButton: {
    backgroundColor: "#6200ee",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  letterButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
