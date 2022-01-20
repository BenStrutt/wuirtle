"use strict";

import { RenderNode } from "./RenderNode.js";

export class RoundBox extends RenderNode {
	/**
	 * The style that the rendering context will
	 * use to draw strokes on the canvas.
	 * @type {string}
	 */
	strokeStyle = "#00f";

	/**
	 * The style that the rendering context will
	 * use to fill shapes/paths on the canvas.
	 * @type {string}
	 */
	fillStyle = "#fff5db";

	/**
	 * Corner radious of thid box. Should be no
	 * larger than one half of the length of the
	 * shortest side of the box.
	 * @type {number}
	 */
	cornerRadius = 30;

	/**
	 * Whether the box is to be filled on render.
	 * @type {boolean}
	 */
	fill = true;

	/**
	 * Whether the outline of the box is to be drawn on render.
	 * @type {boolean}
	 */
	stroke = true;

	/**
	 * @param {number} width 
	 * @param {number} height 
	 */
	resize(width, height) {
		super.resize(width, height);

		const minSide = Math.min(width, height);
		const maxCornerRadius = minSide / 2;
		
		if (maxCornerRadius < this.cornerRadius) {
			this.cornerRadius = maxCornerRadius;
		}
	}

	/**
	 * @override
	 * @param {CanvasRenderingContext2D} context 
	 */
	render(context) {
		const width = this.width;
		const height = this.height;
		const radius = 10;

		let { x, y } = this;
		if (this.parent) {
			const [ parentX, parentY ] = this.parentWorldPosition;
			x = (parentX - (this.parent.width * 0.5)) + this.x;
			y = (parentY - (this.parent.height * 0.5)) + this.y;
		}

		x += this.width * 0.5;
		y += this.height * 0.5;

		context.fillStyle = this.fillStyle;
		context.strokeStyle = this.strokeStyle;

		context.beginPath();
		context.moveTo(x - radius, y);

		context.arcTo(x - width, y, x - width, y - height, radius);
		context.arcTo(x - width, y - height, x, y - height, radius);
		context.arcTo(x, y - height, x, y, radius);
		context.arcTo(x, y, x - width, y, radius);

		context.fill();
		context.stroke();
	}
}