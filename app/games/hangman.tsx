import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const words = ["REACT", "NATIVE", "JAVASCRIPT", "EXPO", "HANGMAN"];

export default function HangmanGame() {
  const [word, setWord] = useState(
    words[Math.floor(Math.random() * words.length)]
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  const maxWrongGuesses = 6;

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

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  checkGameOver();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangman Game</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  word: {
    flexDirection: "row",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  letter: {
    fontSize: 24,
    marginHorizontal: 5,
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
  },
});
