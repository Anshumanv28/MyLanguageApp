import { useState, useEffect } from "react";
import { WordModel } from "../models/WordModel"; // Import the WordModel

const API_URL = "https://learnirula.azurewebsites.net/api/";

export function useFetchWords() {
  const [words, setWords] = useState<WordModel[]>([]); // Use WordModel here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      console.log("Fetching words from API..."); // Debug log
      try {
        const response = await fetch(API_URL);
        console.log("API Response Status:", response.status); // Log response status
        if (!response.ok) {
          throw new Error(`Failed to fetch words: ${response.statusText}`);
        }
        const data: WordModel[] = await response.json();
        console.log("Fetched Words:", data); // Log the parsed data
        setWords(data);
      } catch (err: any) {
        console.error("Error fetching words:", err.message); // Log error
        setError(err.message || "An error occurred");
      } finally {
        console.log("Setting loading to false"); // Debug log
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  return { words, loading, error };
}
