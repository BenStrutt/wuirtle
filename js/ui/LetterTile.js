"use strict";

import { TextBox } from "./TextBox.js";

export class LetterTile extends TextBox {
	/** @type {number} */
	fontSize;

	/**
	 * @private
	 * @type {string}
	 */
	#_letter = "";

	constructor(letter = "") {
		super();

		this.letter = letter;
	}

	get letter() {
		return this.#_letter;
	}

	set letter(letter) {
		this.text = letter;
		this.#_letter = letter;
	}
}
