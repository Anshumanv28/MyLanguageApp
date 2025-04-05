export interface WordModel {
  _id: string; // Unique identifier for the word
  lexicalUnit: string; // Lexical representation of the word
  audioPath: string; // URL to the audio file for pronunciation
  picturePath: string; // URL to the image representing the word
  grammaticalInfo: string; // Grammatical information (e.g., noun, verb)
  enWord: string; // English word
  irulaWord: string; // Irula word
  taWord: string; // Tamil word
  enMeaning: string; // English meaning of the word
  taMeaning: string; // Tamil meaning of the word
  category: string; // Category of the word (e.g., Physical Action)
}
