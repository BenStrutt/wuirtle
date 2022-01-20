"use strict";

import { RoundBox } from "./RoundBox.js";

export class SettingsButton extends RoundBox {
	constructor() {
		super();
	}

	/**
	 * @override
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		if (!this.visible) { return; }

		super.render(context);

		const minSide = Math.min(this.width, this.height);
		const fontSize = this.fontSize ? this.fontSize : Math.floor(minSide * 0.5);
		const font = `${fontSize}px Arial, sans-serif`;
		const text = "settings";

		context.font = font;
		context.textAlign = "center";
		context.textBaseline = "alphabetic";
		context.fillStyle = "black";

		const { actualBoundingBoxAscent } = context.measureText(text);
		const halfHeight = Math.ceil(actualBoundingBoxAscent) * 0.5;

		context.fillText(
			text,
			this.x,
			this.y + halfHeight,
		);
	}
}
