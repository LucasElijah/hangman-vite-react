import { useCallback, useEffect, useState } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json";

function getWord() {
	/* gives random number between 0 & 1, and multiplying that by the number of words in wordList.json  */
  return words[Math.floor(Math.random() * words.length)];
}

function App() {
	const [wordToGuess, setWordToGuess] = useState(getWord)

	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

	/* all incorrect letter are not in the word selected to guess */
	const incorrectLetters = guessedLetters.filter(
		(letter) => !wordToGuess.includes(letter)
	);

	const isLoser = incorrectLetters.length >= 6;
	const isWinner = wordToGuess
		.split("")
		.every((letter) => guessedLetters.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetters.includes(letter) || isLoser || isWinner) return;

			setGuessedLetters((currentLetters) => [...currentLetters, letter]);
		},
		[guessedLetters, isWinner, isLoser]
	);

	useEffect(() => {
		/* runs function that takes in keyboard event */
		const handler = (e: KeyboardEvent) => {
			const key = e.key;
			if (!key.match(/^[a-z]$/)) return;

			e.preventDefault();
			addGuessedLetter(key);
		};
		/* add event listener. On keypress, handler function is called */
		document.addEventListener("keypress", handler);

		/* clean up and remove event listener and handler */
		return () => {
			document.removeEventListener("keypress", handler);
		};
	}, [guessedLetters]);

  useEffect(() => {
    /* runs function that takes in keyboard event */
		const handler = (e: KeyboardEvent) => {
			const key = e.key;
			if (key !== "Enter") return

      e.preventDefault()
      setGuessedLetters([])
			setWordToGuess(getWord())
		};
		/* add event listener. On keypress, handler function is called */
		document.addEventListener("keypress", handler);

		/* clean up and remove event listener and handler */
		return () => {
			document.removeEventListener("keypress", handler);
		}
  }, [])

	return (
		<div
			style={{
				maxWidth: "800px",
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				margin: "0 auto",
				alignItems: "center",
			}}
		>
			<div style={{ fontSize: "2rem", textAlign: "center" }}>
				{isWinner && "Winner (Refresh to try again)"}
				{isLoser && "Loser (Refresh to try again)"}
			</div>

			<HangmanDrawing numberOfGuesses={incorrectLetters.length} />
			<HangmanWord
				reveal={isLoser}
				guessedLetters={guessedLetters}
				wordToGuess={wordToGuess}
			/>
			<div style={{ alignSelf: "stretch" }}>
				<Keyboard
					disabled={isWinner || isLoser}
					activeLetters={guessedLetters.filter((letter) =>
						wordToGuess.includes(letter)
					)}
					inactiveLetters={incorrectLetters}
					addGuessedLetter={addGuessedLetter}
				/>
			</div>
		</div>
	);
}

export default App;
