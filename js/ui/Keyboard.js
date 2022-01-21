"use strict";

import { LetterTile } from "./LetterTile.js";
import { RenderNode } from "./RenderNode.js";
import { Logic, MoveType } from "../Logic.js";

/** @type {string[]} */
const QWERTY = [
	"Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
	"A", "S", "D", "F", "G", "H", "J", "K", "L",
	"Z", "X", "C", "V", "B", "N", "M",
];

/** @type {number} */
const ROWS = 3;

/** @type {number} */
const FIRST_ROW_LENGTH = 10;

/** @type {number} */
const SECOND_ROW_LENGTH = 9

/** @type {number} */
const THIRD_ROW_LENGTH = 7;

/**
 * Class to represent the UI keyboard
 * @extends RenderNode
 */
export class Keyboard extends RenderNode {
	/**
	 * A representation of the keyboard as an array of `LetterTile`s.
	 * @private
	 * @type {LetterTile[]}
	 */
	#alphaKeys = [];

	/**
	 * The "enter" key on the keyboard.
	 * @private
	 * @type {Lettertile}
	 */
	#enter = new LetterTile("enter");

	/**
	 * The "back" key on the keyboard.
	 * @private
	 * @type {Lettertile}
	 */
	#back = new LetterTile("back");

	/** @param {Logic} logic */
	constructor(logic) {
		super();

		for (const letter of QWERTY) {
			const letterTile = new LetterTile(letter);
			this.addChild(letterTile);
			this.#alphaKeys.push(letterTile);

			letterTile.onClick.receive(() => {
				logic.input(MoveType.PressLetter, { letter: letterTile.letter });
			});
		}

		this.addChild(this.#enter);
		this.addChild(this.#back);

		this.#enter.onClick.receive(() => logic.input(MoveType.PressEnter));
		this.#back.onClick.receive(() => logic.input(MoveType.PressBackspace));
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
	 * Reveals the colors for each letter in the most recently guessed word.
	 * @param {string} word The word to be guessed.
	 */
	reveal(word, guess) {
		word = Array.from(word);

		for (const alphaKey of this.#alphaKeys) {
			for (const letter of guess) {
				if (alphaKey.letter === letter) {
					const isGreen = word.some(char => char === letter.toLowerCase());

					alphaKey.fillStyle = isGreen ? "green" : "gray";
					continue;
				}
			}
		}
	}

	reset() {
		for (const key of this.#alphaKeys) {
			key.fillStyle = "#fff5db";
		}
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

		for (const letter of this.#alphaKeys) {
			letter.render(context);
		}

		this.#enter.render(context);
		this.#back.render(context);
	}

	/** @private */
	_resizeTiles() {
		const offsetX = this.width / FIRST_ROW_LENGTH;
		const offsetY = this.height / (ROWS + 1);

		this._resizeAlphaTiles(offsetX, offsetY);
		this._resizeEnterAndBack(offsetX);
	}

	/** @private */
	_resizeAlphaTiles(offsetX, offsetY) {
		for (let i = 0; i < QWERTY.length; i++) {
			// TODO: reposition `y` value better/more uniformly
			const letterTile = this.#alphaKeys[i];
			let x;
			let y;

			if (i < FIRST_ROW_LENGTH) {
				// top row
				y = offsetY;
				x = ((FIRST_ROW_LENGTH * 0.5) - (FIRST_ROW_LENGTH - i) + 0.5) * offsetX;
			} else if (i < FIRST_ROW_LENGTH + SECOND_ROW_LENGTH) {
				// middle row
				const column = i - FIRST_ROW_LENGTH;

				y = offsetY * 2;
				x = ((SECOND_ROW_LENGTH * 0.5) - (SECOND_ROW_LENGTH - column) + 0.5) * offsetX;
			} else {
				// bottom row
				const column = i - (FIRST_ROW_LENGTH + SECOND_ROW_LENGTH);

				y = offsetY * 3;
				x = ((THIRD_ROW_LENGTH * 0.5) - (THIRD_ROW_LENGTH - column) + 0.5) * offsetX;
			}

			letterTile.position((this.width * 0.5) + x, y);
			letterTile.resize(this.width / (FIRST_ROW_LENGTH + 2), this.height / (ROWS + 2));
		}
	}

	/** @private */
	_resizeEnterAndBack() {
		// Grab keys used to position "enter" key.
		const qTile = this.#alphaKeys[0];
		const wTile = this.#alphaKeys[1];
		const zTile = this.#alphaKeys[FIRST_ROW_LENGTH + SECOND_ROW_LENGTH];

		// Grab keys used to position "back" key.
		const mTile = this.#alphaKeys[this.#alphaKeys.length - 1];

		const halfAlphaWidth = qTile.width * 0.5;
		const margin = (wTile.x - halfAlphaWidth) - (qTile.x + halfAlphaWidth);

		const enterLeft = qTile.x - halfAlphaWidth;
		const enterRight = zTile.x - halfAlphaWidth - margin;
		const enterWidth = enterRight - enterLeft;

		this.#enter.resize(enterWidth, zTile.height);
		this.#enter.position(enterLeft + (enterWidth * 0.5), zTile.y);

		// The "back" key has same size as the "enter" key and is the same distance
		// from the "M" key as the "enter" key is from the "Z" key.
		this.#back.resize(enterWidth, zTile.height);
		this.#back.position(mTile.x + halfAlphaWidth + margin + (enterWidth * 0.5), zTile.y);
	}
}