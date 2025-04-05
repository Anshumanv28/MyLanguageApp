// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
// } from "react-native";

// const generateCustomLayout = (words) => {
//   const gridSize = 8; // Fixed grid size
//   const grid = Array(gridSize)
//     .fill(null)
//     .map(() => Array(gridSize).fill(".")); // Create an empty grid

//   const hints = []; // To store hints with their positions
//   const hintNumbers = Array(gridSize)
//     .fill(null)
//     .map(() => Array(gridSize).fill(null)); // To store hint numbers for starting cells

//   words.forEach((word, index) => {
//     let placed = false;
//     const isHorizontal = index % 2 === 0; // Alternate direction: even index = horizontal, odd index = vertical

//     while (!placed) {
//       const startRow = Math.floor(Math.random() * gridSize);
//       const startCol = Math.floor(Math.random() * gridSize);

//       // Check if the word fits in the grid
//       if (
//         (isHorizontal && startCol + word.word.length <= gridSize) || // Horizontal
//         (!isHorizontal && startRow + word.word.length <= gridSize) // Vertical
//       ) {
//         let canPlace = true;

//         // Check for conflicts and invalid overlaps
//         for (let i = 0; i < word.word.length; i++) {
//           const row = isHorizontal ? startRow : startRow + i;
//           const col = isHorizontal ? startCol + i : startCol;

//           // Check if the cell is occupied by a different letter
//           if (grid[row][col] !== "." && grid[row][col] !== word.word[i]) {
//             canPlace = false;
//             break;
//           }

//           // Check for adjacent overlaps (above, below, left, right)
//           if (isHorizontal) {
//             if (
//               (row > 0 && grid[row - 1][col] !== ".") || // Above
//               (row < gridSize - 1 && grid[row + 1][col] !== ".") // Below
//             ) {
//               canPlace = false;
//               break;
//             }
//           } else {
//             if (
//               (col > 0 && grid[row][col - 1] !== ".") || // Left
//               (col < gridSize - 1 && grid[row][col + 1] !== ".") // Right
//             ) {
//               canPlace = false;
//               break;
//             }
//           }
//         }

//         // Ensure no invalid concatenations around the word
//         if (canPlace) {
//           for (let i = 0; i < word.word.length; i++) {
//             const row = isHorizontal ? startRow : startRow + i;
//             const col = isHorizontal ? startCol + i : startCol;

//             // Check adjacent cells for invalid concatenations
//             if (isHorizontal) {
//               if (
//                 (row > 0 && grid[row - 1][col] !== ".") || // Above
//                 (row < gridSize - 1 && grid[row + 1][col] !== ".") // Below
//               ) {
//                 canPlace = false;
//                 break;
//               }
//             } else {
//               if (
//                 (col > 0 && grid[row][col - 1] !== ".") || // Left
//                 (col < gridSize - 1 && grid[row][col + 1] !== ".") // Right
//               ) {
//                 canPlace = false;
//                 break;
//               }
//             }
//           }
//         }

//         // Place the word if no conflicts
//         if (canPlace) {
//           for (let i = 0; i < word.word.length; i++) {
//             const row = isHorizontal ? startRow : startRow + i;
//             const col = isHorizontal ? startCol + i : startCol;
//             grid[row][col] = word.word[i];
//           }

//           // Add the hint number to the starting cell
//           hintNumbers[startRow][startCol] = index + 1;

//           // Store the hint with its position
//           hints.push({
//             number: index + 1,
//             hint: word.hint,
//             position: { row: startRow, col: startCol },
//             direction: isHorizontal ? "Across" : "Down",
//           });

//           placed = true;
//         }
//       }
//     }
//   });

//   return { grid, hints, hintNumbers };
// };

// export default function CrosswordGame() {
//   const [words] = useState([
//     { word: "CATCH", hint: "To grab or seize something" },
//     { word: "DOGGIE", hint: "A small dog" },
//     { word: "BATMAN", hint: "A superhero who fights crime" },
//     { word: "HAT", hint: "A head covering" },
//   ]); // Demo words with hints

//   const { grid, hints, hintNumbers } = generateCustomLayout(words); // Generate custom layout
//   const gridSize = grid.length;
//   const [answers, setAnswers] = useState(
//     Array(gridSize)
//       .fill(null)
//       .map(() => Array(gridSize).fill("")) // Initialize empty answers
//   );

//   const inputRefs = useRef([]); // To store references to all TextInput components

//   const handleInputChange = (text, row, col) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[row][col] = text.toUpperCase();
//     setAnswers(updatedAnswers);

//     // Move to the next blank cell
//     const nextCell = findNextCell(row, col);
//     if (nextCell) {
//       const { nextRow, nextCol } = nextCell;
//       inputRefs.current[nextRow][nextCol]?.focus();
//     }
//   };

//   const findNextCell = (row, col) => {
//     // Search for the next blank cell in the grid
//     for (let r = row; r < gridSize; r++) {
//       for (let c = r === row ? col + 1 : 0; c < gridSize; c++) {
//         if (grid[r][c] !== "." && answers[r][c] === "") {
//           return { nextRow: r, nextCol: c };
//         }
//       }
//     }
//     return null; // No next cell found
//   };

//   const checkAnswers = () => {
//     for (let row = 0; row < gridSize; row++) {
//       for (let col = 0; col < gridSize; col++) {
//         if (grid[row][col] !== "." && grid[row][col] !== answers[row][col]) {
//           Alert.alert("Incorrect", "Some answers are incorrect!");
//           return;
//         }
//       }
//     }
//     Alert.alert("Congratulations!", "You solved the crossword!");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Crossword Game</Text>
//       <View style={styles.grid}>
//         {grid.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.row}>
//             {row.map((cell, colIndex) => (
//               <View key={colIndex} style={styles.cellContainer}>
//                 {hintNumbers[rowIndex][colIndex] && (
//                   <Text style={styles.hintNumber}>
//                     {hintNumbers[rowIndex][colIndex]}
//                   </Text>
//                 )}
//                 <TextInput
//                   ref={(ref) => {
//                     if (!inputRefs.current[rowIndex]) {
//                       inputRefs.current[rowIndex] = [];
//                     }
//                     inputRefs.current[rowIndex][colIndex] = ref;
//                   }}
//                   style={[
//                     styles.cell,
//                     cell !== "." ? styles.filledCell : styles.emptyCell,
//                   ]}
//                   maxLength={1}
//                   value={answers[rowIndex][colIndex]}
//                   editable={cell !== "."}
//                   onChangeText={(text) =>
//                     handleInputChange(text, rowIndex, colIndex)
//                   }
//                 />
//               </View>
//             ))}
//           </View>
//         ))}
//       </View>
//       <TouchableOpacity style={styles.button} onPress={checkAnswers}>
//         <Text style={styles.buttonText}>Check Answers</Text>
//       </TouchableOpacity>
//       <View style={styles.hints}>
//         {hints.map((hint) => (
//           <Text key={hint.number} style={styles.hint}>
//             {hint.number}. {hint.hint} ({hint.direction})
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   grid: {
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   cellContainer: {
//     position: "relative",
//   },
//   hintNumber: {
//     position: "absolute",
//     top: -10,
//     left: -10,
//     fontSize: 10,
//     color: "#000",
//   },
//   cell: {
//     width: 40,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#000",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   filledCell: {
//     backgroundColor: "#fff",
//   },
//   emptyCell: {
//     backgroundColor: "#ccc",
//   },
//   button: {
//     backgroundColor: "#6200ee",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     width: "80%",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   hints: {
//     marginTop: 20,
//     alignItems: "flex-start",
//   },
//   hint: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });

//with loading screen

// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { useFetchWords } from "../../hooks/useFetchWords";

// const generateCustomLayout = (words) => {
//   const gridSize = 8; // Fixed grid size
//   const grid = Array(gridSize)
//     .fill(null)
//     .map(() => Array(gridSize).fill(".")); // Create an empty grid

//   const hints = []; // To store hints with their positions
//   const hintNumbers = Array(gridSize)
//     .fill(null)
//     .map(() => Array(gridSize).fill(null)); // To store hint numbers for starting cells

//   words.forEach((word, index) => {
//     let placed = false;
//     const isHorizontal = index % 2 === 0; // Alternate direction: even index = horizontal, odd index = vertical

//     while (!placed) {
//       const startRow = Math.floor(Math.random() * gridSize);
//       const startCol = Math.floor(Math.random() * gridSize);

//       // Check if the word fits in the grid
//       if (
//         (isHorizontal && startCol + word.word.length <= gridSize) || // Horizontal
//         (!isHorizontal && startRow + word.word.length <= gridSize) // Vertical
//       ) {
//         let canPlace = true;

//         // Check for conflicts and invalid overlaps
//         for (let i = 0; i < word.word.length; i++) {
//           const row = isHorizontal ? startRow : startRow + i;
//           const col = isHorizontal ? startCol + i : startCol;

//           // Check if the cell is occupied by a different letter
//           if (grid[row][col] !== "." && grid[row][col] !== word.word[i]) {
//             canPlace = false;
//             break;
//           }
//         }

//         // Ensure adjacent cells before the start and after the end are empty
//         if (canPlace) {
//           const beforeStartRow = isHorizontal ? startRow : startRow - 1;
//           const beforeStartCol = isHorizontal ? startCol - 1 : startCol;
//           const afterEndRow = isHorizontal
//             ? startRow
//             : startRow + word.word.length;
//           const afterEndCol = isHorizontal
//             ? startCol + word.word.length
//             : startCol;

//           if (
//             (beforeStartRow >= 0 &&
//               beforeStartCol >= 0 &&
//               grid[beforeStartRow]?.[beforeStartCol] !== ".") ||
//             (afterEndRow < gridSize &&
//               afterEndCol < gridSize &&
//               grid[afterEndRow]?.[afterEndCol] !== ".")
//           ) {
//             canPlace = false;
//           }
//         }

//         // Ensure no invalid touching at the start or end of the word
//         if (canPlace) {
//           for (let i = 0; i < word.word.length; i++) {
//             const row = isHorizontal ? startRow : startRow + i;
//             const col = isHorizontal ? startCol + i : startCol;

//             // Check adjacent cells for invalid touching
//             if (isHorizontal) {
//               if (
//                 (row > 0 && grid[row - 1][col] !== ".") || // Above
//                 (row < gridSize - 1 && grid[row + 1][col] !== ".") // Below
//               ) {
//                 canPlace = false;
//                 break;
//               }
//             } else {
//               if (
//                 (col > 0 && grid[row][col - 1] !== ".") || // Left
//                 (col < gridSize - 1 && grid[row][col + 1] !== ".") // Right
//               ) {
//                 canPlace = false;
//                 break;
//               }
//             }
//           }
//         }

//         // Place the word if no conflicts
//         if (canPlace) {
//           for (let i = 0; i < word.word.length; i++) {
//             const row = isHorizontal ? startRow : startRow + i;
//             const col = isHorizontal ? startCol + i : startCol;
//             grid[row][col] = word.word[i];
//           }

//           // Add the hint number to the starting cell
//           hintNumbers[startRow][startCol] = index + 1;

//           // Store the hint with its position
//           hints.push({
//             number: index + 1,
//             hint: word.hint,
//             position: { row: startRow, col: startCol },
//             direction: isHorizontal ? "Across" : "Down",
//           });

//           placed = true;
//         }
//       }
//     }
//   });

//   return { grid, hints, hintNumbers };
// };

// export default function CrosswordGame() {
//   const { words, loading, error } = useFetchWords(); // Fetch words dynamically
//   const [formattedWords, setFormattedWords] = useState(null); // State for formatted words

//   // Format words once they are fetched
//   useEffect(() => {
//     if (words.length > 0) {
//       const formatted = words.map((word) => ({
//         word: word.enWord.toUpperCase(),
//         hint: word.enMeaning,
//       }));
//       setFormattedWords(formatted);
//     }
//   }, [words]);

//   if (loading || !formattedWords) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#6200ee" />
//         <Text>Loading words...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error: {error}</Text>
//       </View>
//     );
//   }

//   if (formattedWords.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text>No words available.</Text>
//       </View>
//     );
//   }

//   const { grid, hints, hintNumbers } = generateCustomLayout(formattedWords); // Generate custom layout
//   const gridSize = grid.length;
//   const [answers, setAnswers] = useState(
//     Array(gridSize)
//       .fill(null)
//       .map(() => Array(gridSize).fill("")) // Initialize empty answers
//   );

//   const inputRefs = useRef([]); // To store references to all TextInput components

//   const handleInputChange = (text, row, col) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[row][col] = text.toUpperCase();
//     setAnswers(updatedAnswers);

//     // Move to the next blank cell
//     const nextCell = findNextCell(row, col);
//     if (nextCell) {
//       const { nextRow, nextCol } = nextCell;
//       inputRefs.current[nextRow][nextCol]?.focus();
//     }
//   };

//   const findNextCell = (row, col) => {
//     // Search for the next blank cell in the grid
//     for (let r = row; r < gridSize; r++) {
//       for (let c = r === row ? col + 1 : 0; c < gridSize; c++) {
//         if (grid[r][c] !== "." && answers[r][c] === "") {
//           return { nextRow: r, nextCol: c };
//         }
//       }
//     }
//     return null; // No next cell found
//   };

//   const checkAnswers = () => {
//     for (let row = 0; row < gridSize; row++) {
//       for (let col = 0; col < gridSize; col++) {
//         if (grid[row][col] !== "." && grid[row][col] !== answers[row][col]) {
//           Alert.alert("Incorrect", "Some answers are incorrect!");
//           return;
//         }
//       }
//     }
//     Alert.alert("Congratulations!", "You solved the crossword!");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Crossword Game</Text>
//       <View style={styles.grid}>
//         {grid.map((row, rowIndex) => (
//           <View key={rowIndex} style={styles.row}>
//             {row.map((cell, colIndex) => (
//               <View key={colIndex} style={styles.cellContainer}>
//                 {hintNumbers[rowIndex][colIndex] && (
//                   <Text style={styles.hintNumber}>
//                     {hintNumbers[rowIndex][colIndex]}
//                   </Text>
//                 )}
//                 <TextInput
//                   ref={(ref) => {
//                     if (!inputRefs.current[rowIndex]) {
//                       inputRefs.current[rowIndex] = [];
//                     }
//                     inputRefs.current[rowIndex][colIndex] = ref;
//                   }}
//                   style={[
//                     styles.cell,
//                     cell !== "." ? styles.filledCell : styles.emptyCell,
//                   ]}
//                   maxLength={1}
//                   value={answers[rowIndex][colIndex]}
//                   editable={cell !== "."}
//                   onChangeText={(text) =>
//                     handleInputChange(text, rowIndex, colIndex)
//                   }
//                 />
//               </View>
//             ))}
//           </View>
//         ))}
//       </View>
//       <TouchableOpacity style={styles.button} onPress={checkAnswers}>
//         <Text style={styles.buttonText}>Check Answers</Text>
//       </TouchableOpacity>
//       <View style={styles.hints}>
//         {hints.map((hint) => (
//           <Text key={hint.number} style={styles.hint}>
//             {hint.number}. {hint.hint} ({hint.direction})
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F5F5F5",
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   grid: {
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   row: {
//     flexDirection: "row",
//   },
//   cellContainer: {
//     position: "relative",
//   },
//   hintNumber: {
//     position: "absolute",
//     top: -10,
//     left: -10,
//     fontSize: 10,
//     color: "#000",
//   },
//   cell: {
//     width: 40,
//     height: 40,
//     borderWidth: 1,
//     borderColor: "#000",
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   filledCell: {
//     backgroundColor: "#fff",
//   },
//   emptyCell: {
//     backgroundColor: "#ccc",
//   },
//   button: {
//     backgroundColor: "#6200ee",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     width: "80%",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
//   hints: {
//     marginTop: 20,
//     alignItems: "flex-start",
//   },
//   hint: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
// });
