import React, { useState, useRef, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFetchWords } from "../../hooks/useFetchWords";
import { WordModel } from "../../models/WordModel"; // Import WordModel

const generateCustomLayout = (words: { word: string; hint: string }[]) => {
  console.log(
    "Generating layout for words:",
    words.map((w) => w.word) // Log only the words
  );
  const gridSize = 8; // Fixed grid size
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(".")); // Create an empty grid

  const hints = []; // To store hints with their positions
  const hintNumbers = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(null)); // To store hint numbers for starting cells

  words.forEach((word, index) => {
    let placed = false;
    const isHorizontal = index % 2 === 0; // Alternate direction: even index = horizontal, odd index = vertical

    while (!placed) {
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      // Check if the word fits in the grid
      if (
        (isHorizontal && startCol + word.word.length <= gridSize) || // Horizontal
        (!isHorizontal && startRow + word.word.length <= gridSize) // Vertical
      ) {
        let canPlace = true;

        // Check for conflicts and invalid overlaps
        for (let i = 0; i < word.word.length; i++) {
          const row = isHorizontal ? startRow : startRow + i;
          const col = isHorizontal ? startCol + i : startCol;

          // Check if the cell is occupied by a different letter
          if (grid[row][col] !== "." && grid[row][col] !== word.word[i]) {
            canPlace = false;
            break;
          }
        }

        // Ensure adjacent cells before the start and after the end are empty
        if (canPlace) {
          const beforeStartRow = isHorizontal ? startRow : startRow - 1;
          const beforeStartCol = isHorizontal ? startCol - 1 : startCol;
          const afterEndRow = isHorizontal
            ? startRow
            : startRow + word.word.length;
          const afterEndCol = isHorizontal
            ? startCol + word.word.length
            : startCol;

          if (
            (beforeStartRow >= 0 &&
              beforeStartCol >= 0 &&
              grid[beforeStartRow]?.[beforeStartCol] !== ".") ||
            (afterEndRow < gridSize &&
              afterEndCol < gridSize &&
              grid[afterEndRow]?.[afterEndCol] !== ".")
          ) {
            canPlace = false;
          }
        }

        // Place the word if no conflicts
        if (canPlace) {
          for (let i = 0; i < word.word.length; i++) {
            const row = isHorizontal ? startRow : startRow + i;
            const col = isHorizontal ? startCol + i : startCol;
            grid[row][col] = word.word[i];
          }

          // Add the hint number to the starting cell
          hintNumbers[startRow][startCol] = index + 1;

          // Store the hint with its position
          hints.push({
            number: index + 1,
            hint: word.hint,
            position: { row: startRow, col: startCol },
            direction: isHorizontal ? "Across" : "Down",
          });

          placed = true;
        }
      }
    }
  });

  console.log("Generated grid layout:", grid); // Log the generated grid
  console.log("Generated hints:", hints); // Log the hints
  console.log("Generated hint numbers:", hintNumbers); // Log the hint numbers
  return { grid, hints, hintNumbers };
};

const Cell = memo(({ value, editable, onChangeText, hintNumber, inputRef }) => {
  return (
    <View style={styles.cellContainer}>
      {hintNumber && <Text style={styles.hintNumber}>{hintNumber}</Text>}
      <TextInput
        ref={inputRef}
        style={[
          styles.cell,
          value !== "." ? styles.filledCell : styles.emptyCell,
        ]}
        maxLength={1}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
      />
    </View>
  );
});

export default function CrosswordGame() {
  const { words, loading, error } = useFetchWords(); // Fetch words dynamically

  console.log("Words fetched:", words); // Log fetched words
  console.log("Loading state:", loading); // Log loading state
  console.log("Error state:", error); // Log error state

  if (loading) {
    console.log("Loading words..."); // Log loading state
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Loading words...</Text>
      </View>
    );
  }

  if (error) {
    console.error("Error fetching words:", error); // Log error
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!words || words.length === 0) {
    console.warn("No words available."); // Log no words warning
    return (
      <View style={styles.container}>
        <Text>No words available.</Text>
      </View>
    );
  }

  // Select 5 random words from the fetched words
  const selectedWords = words
    .filter((word: WordModel) => word.enWord && word.enMeaning) // Ensure valid data
    .sort(() => 0.5 - Math.random()) // Shuffle the array
    .slice(0, 5) // Take the first 5 words
    .map((word: WordModel) => ({
      word: word.enWord.toUpperCase(),
      hint: word.enMeaning,
    }));

  console.log(
    "Selected words for crossword:",
    selectedWords.map((w) => ({ word: w.word, hint: w.hint }))
  ); // Log selected words with hints

  const { grid, hints, hintNumbers } = generateCustomLayout(selectedWords); // Generate custom layout
  console.log("Generated grid:", grid); // Log the generated grid

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crossword Game</Text>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <Cell
                key={colIndex}
                value={cell}
                editable={cell !== "."}
                onChangeText={(text) =>
                  console.log(`Input at [${rowIndex}, ${colIndex}]:`, text)
                } // Log input changes
                hintNumber={hintNumbers[rowIndex][colIndex]}
                inputRef={(ref) => {
                  console.log(
                    `Input ref set for cell [${rowIndex}, ${colIndex}]`
                  ); // Log input refs
                }}
              />
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => console.log("Check Answers button pressed")} // Log button press
      >
        <Text style={styles.buttonText}>Check Answers</Text>
      </TouchableOpacity>
      <View style={styles.hints}>
        {hints.map((hint) => (
          <Text key={hint.number} style={styles.hint}>
            {hint.number}. {hint.hint} ({hint.direction})
          </Text>
        ))}
      </View>
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
  grid: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  cellContainer: {
    position: "relative",
  },
  hintNumber: {
    position: "absolute",
    top: -10,
    left: -10,
    fontSize: 10,
    color: "#000",
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  filledCell: {
    backgroundColor: "#fff",
  },
  emptyCell: {
    backgroundColor: "#ccc",
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  hints: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  hint: {
    fontSize: 16,
    marginBottom: 5,
  },
});
