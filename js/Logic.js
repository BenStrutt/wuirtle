"use strict";

import { ospd as fullDict } from "./generated/ospd.js";
import { common as commonWords } from "./generated/common.js";
import { Trie } from "./Trie/Trie.js";
import { Signal } from "./util/Signal.js";

/**
 * @enum {number}
 */
export const MoveType = (function() {
	let _enum = 0;
	return {
		PressLetter: _enum++,
		PressEnter: _enum++,
		PressBackspace: _enum++,
		PressReveal: _enum++,
		PressReplay: _enum++,
	};
})();

export class Logic {
	// I can't figure out how to type these signales in JSDoc-style comments. Sorry
	onLetterPress = new Signal();
	onBackspacePress = new Signal();
	onEnterPress = new Signal();
	onReplayPress = new Signal();
	onRevealPress = new Signal();

	/**
	 * A trie structure to hold our entire dictionary of valid English words.
	 * @private
	 * @type {Trie}
	 */
	#dictionary = new Trie();

	/**
	 * The word to be guessed.
	 * @private
	 * @type {string}
	 */
	#word;

	/**
	 * The length of the word to be guessed.
	 * @private
	 * @type {number}
	 */
	#wordLength;

	/**
	 * The total amount of guesses provided.
	 * @private
	 * @type {number}
	 */
	#guessAmount;

	/**
	 * The tile that is currently to be filled.
	 * @private
	 * @type {number}
	 */
	#activeRow = 0;

	/**
	 * An array of letters to store user guesses.
	 * @private
	 * @type {string[]}
	 */
	#guesses = [];

	/**
	 * @private
	 * @type {boolean}
	 */
	#gameOver = false;

	/**
	 * @private
	 * @type {Function[]}
	 */
	#inputFunctions;

	/**
	 * @param {number} wordLength The length of the word to be guessed.
	 * @param {number} guessAmount The amount of guesses allowed.
	 */
	constructor(wordLength = 5, guessAmount = 6) {
		this.#wordLength = wordLength;
		this.#guessAmount = guessAmount;

		this.#dictionary.load(fullDict);

		this._setNewWord();

		this.#inputFunctions = [
			this._letterInput.bind(this),
			this._enterInput.bind(this),
			this._backspaceInput.bind(this),
			this._revealInput.bind(this),
			this._replayInput.bind(this),
		];
	}

	/**
	 * @param {number} moveType 
	 * @param {object} data 
	 */
	input(moveType, data) {
		this.#inputFunctions[moveType](data);
	}

	/**
	 * Sets a new word to be guessed.
	 * @private
	 */
	_setNewWord() {
		const filteredWords = commonWords.filter(word => word.length === this.#wordLength);
		const commonWordsIndex = Math.floor(Math.random() * filteredWords.length);
		this.#word = filteredWords[commonWordsIndex];
	}

	/**
	 * Handles a letter press by the user.
	 * @private
	 */
	_letterInput(data) {
		if (this.#gameOver) { return; }

		const letter = data.letter;
		const maxLength = (this.#activeRow * this.#wordLength) + this.#wordLength;

		if (this.#guesses.length === maxLength) {
			// TODO: Some sort of animation to indicate invalid letter press

			return;
		}

		this.onLetterPress.emit(letter);
		this.#guesses.push(letter);
	}

	/**
	 * Handles an enter press by the user.
	 * @private
	 */
	_enterInput() {
		if (this.#gameOver) { return; }

		const maxSize = (this.#activeRow * this.#wordLength) + this.#wordLength;
		const guess = this.#guesses.slice(this.#guesses.length - this.#wordLength);

		if (this.#guesses.length < maxSize || !this.#dictionary.isValidWord(guess.join("").toLowerCase())) {
			// TODO: Some sort of animation to indicate invalid enter press

			return;
		}

		this.onEnterPress.emit(this.#word, guess);

		const isOutOfGuesses = ++this.#activeRow > this.#guessAmount;
		const isWinningGuess = guess.join("").toLowerCase() === this.#word;

		if (isOutOfGuesses || isWinningGuess) { this.#gameOver = true; }
	}

	/**
	 * Handles a backspace press by the user.
	 * @private
	 */
	_backspaceInput() {
		if (this.#gameOver) { return; }

		const minSize = this.#activeRow * this.#wordLength;

		if (this.#guesses.length === minSize) {
			// TODO: Some sort of animation to indicate invalid back press

			return;
		}

		this.onBackspacePress.emit();
		this.#guesses.pop();
	}

	/**
	 * Handles a backspace press by the user.
	 * @private
	 */
	_revealInput() {
		this.#gameOver = true;
		this.onRevealPress.emit(this.#word);
	}

	/**
	 * Handles a backspace press by the user.
	 * @private
	 */
	_replayInput() {
		this._setNewWord();
		this.#gameOver = false;
		this.#activeRow = 0;
		this.#guesses.length = 0;

		this.onReplayPress.emit();
	}
}