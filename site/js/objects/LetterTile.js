"use strict";

import { RoundBox } from "./RoundBox.js";

export class LetterTile extends RoundBox {
	letter = "";
	fontSize;

	constructor(letter = "") {
		super();

		this.letter = letter;
	}

	/**
	 * @override
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		super.render(context);

		const minSide = Math.min(this.width, this.height);

		const [ parentX, parentY ] = this.parentWorldPosition;

		const fontSize = this.fontSize ? this.fontSize : Math.floor(minSide * 0.5);
		const font = `${fontSize}px Arial, sans-serif`;

		context.font = font;
		context.textAlign = "center";
		context.textBaseline = "alphabetic";
		context.fillStyle = "black";

		const { actualBoundingBoxAscent } = context.measureText(this.letter);
		const halfHeight = Math.ceil(actualBoundingBoxAscent) * 0.5;

		context.fillText(
			this.letter,
			this.x + (parentX - (this.parent.width * 0.5)),
			this.y + halfHeight + (parentY - (this.parent.height * 0.5)),
		);
	}
}
