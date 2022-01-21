"use strict";

import { RoundBox } from "./RoundBox.js";

export class TextBox extends RoundBox {
	/**
	 * The text to be displayed inside box
	 * @type {string}
	 */
	text;

	/** @param {string} text */
	constructor(text = "") {
		super();

		this.text = text;
	}

	/**
	 * @override
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		if (!this.visible) { return; }

		super.render(context);

		context.textAlign = "center";
		context.textBaseline = "alphabetic";
		context.fillStyle = "black";

		// I know that this is a mess, I promise I'll fix it.
		// This just ensures that the rendered text width is
		// no larger than half of the box's width.
		const minSide = Math.min(this.width, this.height);
		let fontSize = this.fontSize ? this.fontSize : Math.floor(minSide * 0.5);
		let font = `${fontSize}px Arial, sans-serif`;
		context.font = font;
		let width = context.measureText(this.text).width;
		while (width > this.width * 0.5) {
			fontSize--;
			font = `${fontSize}px Arial, sans-serif`;
			context.font = font;
			width = context.measureText(this.text).width;
		} 


		let { x, y } = this;
		const actualBoundingBoxAscent = context.measureText(this.text).actualBoundingBoxAscent;
		const halfHeight = Math.ceil(actualBoundingBoxAscent) * 0.5;

		if (this.parent) {
			const [ parentX, parentY ] = this.parentWorldPosition;

			x += parentX - (this.parent.width * 0.5);
			y += parentY - (this.parent.height * 0.5);
		}

		context.fillText(this.text, x, y + halfHeight);
	}
}