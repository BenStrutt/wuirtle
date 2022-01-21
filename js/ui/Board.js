"use strict";

import { RenderNode } from "./RenderNode.js";
import { LetterTile } from "./LetterTile.js";

/**
 * Class to represent the entire playing area
 * and the elements contained within
 * @extends RenderNode
 */
export class Board extends RenderNode {
	/**
	 * A representation of the "board" as an array of `LetterTile`s.
	 * @private
	 * @type {LetterTile[]}
	 */
	#tiles;

	/** 
	 * Will be the same as word length.
	 * @private
	 * @type {number}
	 */
	#rows;

	/**
	 * Will be the same as max guesses.
	 * @private
	 * @type {number}
	 */
	#columns;

	/**
	 * The index of the next available tile
	 * @private
	 * @type {number}
	 */
	#activeIndex = 0;

	/**
	 * @param {number} wordLength The length of words to be guessed.
	 * @param {number} guessAmount The amount of guesses provided to get the word.
	 */
	constructor(wordLength = 5, guessAmount = 6) {
		super();

		this.#columns = wordLength;
		this.#rows = guessAmount;

		this.#tiles = new Array(wordLength * guessAmount);
		for (let i = 0; i < this.#tiles.length; i++) {
			const tile = new LetterTile();

			this.addChild(tile);
			this.#tiles[i] = tile;
		}
	}

	/**
	 * Adds a letter to the next available square.
	 * @param {string} letter The letter to add. 
	 */
	addLetter(letter) {
		const tile = this.#tiles[this.#activeIndex++];

		tile.letter = letter;
	}

	/**
	 * Removes the letter from the most recently added square.
	 */
	removeLetter() {
		const tile = this.#tiles[--this.#activeIndex];

		tile.letter = "";
	}

	/**
	 * Reveals the colors for each letter in the most recently added word.
	 * @param {string} word The word to be guessed.
	 */
	reveal(word) {
		for (let i = this.#activeIndex - 5; i < this.#activeIndex; i++) {
			const tile = this.#tiles[i];
			word = Array.from(word);

			if (tile.letter.toLowerCase() === word[i % this.#columns].toLowerCase()) {
				tile.fillStyle = "green";
				continue;
			} else if (word.some(c=>c===tile.letter.toLowerCase())) {
				tile.fillStyle = "yellow";
			}
		}
	}

	/**
	 * Resets each tile's letter and fill color.
	 */
	reset() {
		for (const tile of this.#tiles) {
			tile.fillStyle = "#fff5db";
			tile.letter = "";
		}

		this.#activeIndex = 0;
	}

	/**
	 * @override
	 * @param {number} width The width of the game board.
	 * @param {number} height The height of the game board.
	 */
	resize(width, height) {
		super.resize(width, height);

		this._resizeTiles();
	}

	/**
	 * Renders the board and all its elements
	 * @param {CanvasRenderingContext2D} context
	 */
	render(context) {
		if (!this.visible) { return; }

		if (this.stroke) {
			context.strokeStyle = "blue";
			context.strokeRect(
				this.x - this.width + (this.width * 0.5),
				this.y - this.height + (this.height * 0.5),
				this.width,
				this.height,
			);
		}

		this.#tiles.forEach(tile => tile.render(context));
	}

	/** @private */
	_resizeTiles() {
		const boardLength = this.#tiles.length;

		for (let i = 0; i < boardLength; i++) {
			const tile = this.#tiles[i];
			const x = i % this.#columns;
			const y = Math.floor(i / this.#columns);

			const positionX = (this.#columns * 0.5) - (this.#columns - x) + 0.5;
			const offsetX = this.width / this.#columns;
			const positionY = (this.#rows * 0.5) - (this.#rows - y) + 0.5;
			const offsetY = this.height / this.#rows;
			const size = Math.min(
				(this.width * 0.9) / this.#columns,
				(this.height * 0.9) / this.#rows,
			);
			const fontSize = Math.floor(size * 0.75);

			tile.resize(size, size);
			tile.fontSize = fontSize;
			tile.position(
				(this.width * 0.5) + (positionX * offsetX),
				(this.height * 0.5) + (positionY * offsetY),
			);
		}
	}
}