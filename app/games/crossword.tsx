import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

const generateCustomLayout = (words) => {
  const gridSize = 8; // Fixed grid size
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(".")); // Create an empty grid

  words.forEach((word, index) => {
    let placed = false;

    while (!placed) {
      const isHorizontal = Math.random() > 0.5; // Randomly decide direction
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      // Check if the word fits in the grid
      if (
        (isHorizontal && startCol + word.length <= gridSize) || // Horizontal
        (!isHorizontal && startRow + word.length <= gridSize) // Vertical
      ) {
        let canPlace = true;

        // Check for conflicts with existing letters
        for (let i = 0; i < word.length; i++) {
          const row = isHorizontal ? startRow : startRow + i;
          const col = isHorizontal ? startCol + i : startCol;

          if (grid[row][col] !== "." && grid[row][col] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        // Place the word if no conflicts
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            const row = isHorizontal ? startRow : startRow + i;
            const col = isHorizontal ? startCol + i : startCol;
            grid[row][col] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  return grid;
};

export default function CrosswordGame() {
  const [words] = useState(["CAT", "DOG", "BAT", "HAT"]); // Demo words
  const layout = { grid: generateCustomLayout(words) }; // Generate custom layout
  const gridSize = layout.grid.length;
  const [answers, setAnswers] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill("")) // Initialize empty answers
  );

  const inputRefs = useRef([]); // To store references to all TextInput components

  const handleInputChange = (text, row, col) => {
    const updatedAnswers = [...answers];
    updatedAnswers[row][col] = text.toUpperCase();
    setAnswers(updatedAnswers);

    // Move to the next blank cell
    const nextCell = findNextCell(row, col);
    if (nextCell) {
      const { nextRow, nextCol } = nextCell;
      inputRefs.current[nextRow][nextCol]?.focus();
    }
  };

  const findNextCell = (row, col) => {
    // Search for the next blank cell in the grid
    for (let r = row; r < gridSize; r++) {
      for (let c = r === row ? col + 1 : 0; c < gridSize; c++) {
        if (layout.grid[r][c] !== "." && answers[r][c] === "") {
          return { nextRow: r, nextCol: c };
        }
      }
    }
    return null; // No next cell found
  };

  const checkAnswers = () => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (
          layout.grid[row][col] !== "." &&
          layout.grid[row][col] !== answers[row][col]
        ) {
          Alert.alert("Incorrect", "Some answers are incorrect!");
          return;
        }
      }
    }
    Alert.alert("Congratulations!", "You solved the crossword!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crossword Game</Text>
      <View style={styles.grid}>
        {layout.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TextInput
                key={colIndex}
                ref={(ref) => {
                  if (!inputRefs.current[rowIndex]) {
                    inputRefs.current[rowIndex] = [];
                  }
                  inputRefs.current[rowIndex][colIndex] = ref;
                }}
                style={[
                  styles.cell,
                  cell !== "." ? styles.filledCell : styles.emptyCell,
                ]}
                maxLength={1}
                value={answers[rowIndex][colIndex]}
                editable={cell !== "."}
                onChangeText={(text) =>
                  handleInputChange(text, rowIndex, colIndex)
                }
              />
            ))}
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={checkAnswers}>
        <Text style={styles.buttonText}>Check Answers</Text>
      </TouchableOpacity>
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
});
