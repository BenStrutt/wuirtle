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
	};
})();

export class Logic {
	// I can't figure out how to type these signales in JSDoc-style comments. Sorry
	onLetterPress = new Signal();
	onBackspacePress = new Signal();
	onEnterPress = new Signal();

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

		const filteredWords = commonWords.filter(word => word.length === wordLength);
		const commonWordsIndex = Math.floor(Math.random() * filteredWords.length);
		this.#word = filteredWords[commonWordsIndex];

		this.#inputFunctions = [
			this._letterInput.bind(this),
			this._enterInput.bind(this),
			this._backspaceInput.bind(this),
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
	 * Handles a letter press by the user.
	 * @private
	 */
	_letterInput(data) {
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
		const maxSize = (this.#activeRow * this.#wordLength) + this.#wordLength;
		const guess = this.#guesses.slice(this.#guesses.length - this.#wordLength);

		if (this.#guesses.length < maxSize || !this.#dictionary.isValidWord(guess.join("").toLowerCase())) {
			// TODO: Some sort of animation to indicate invalid enter press

			return;
		}

		this.onEnterPress.emit(this.#word, guess);

		if (++this.#activeRow > this.#guessAmount) {
			// TODO: fail the player
			return;
		}
	}

	/**
	 * Handles a backspace press by the user.
	 * @private
	 */
	_backspaceInput() {
		const minSize = this.#activeRow * this.#wordLength;

		if (this.#guesses.length === minSize) {
			// TODO: Some sort of animation to indicate invalid back press

			return;
		}

		this.onBackspacePress.emit();
		this.#guesses.pop();
	}
}