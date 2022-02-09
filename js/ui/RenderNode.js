"use strict";

import { Signal } from "../util/Signal.js";

/**
 * Base class for rendering UI elements.
 * Meant to provide common positioning/size
 * elements and should be extended for use.
 */
export class RenderNode {
	/** @type {Signal} */
	onClick = new Signal();

	/** @type {number} */
	x = 0;

	/** @type {number} */
	y = 0;

	/** @type {number} */
	width = 0;

	/** @type {number} */
	height = 0;

	/** @type {number} */
	anchorX = 0.5;

	/** @type {number} */
	anchorY = 0.5;

	/** @type {boolean} */
	visible = true;

	/** @type {RenderNode[]} */
	children = [];

	/** @type {RenderNode} */
	parent = null

	/** @type {boolean} */
	fill = true;

	/** @type {boolean} */
	stroke = true;

	/** @type {number[]} */
	get parentWorldPosition() {
		return this.parent ? this.parent.parentWorldPosition : [this.x, this.y];
	}

	/** @param {RenderNode} child The child node to be added to this node.*/
	addChild(child) {
		child.parent = this;
		this.children.push(child);
	}

	/**
	 * Updates this node's position for rendering purposes.
	 * @param {number} x
	 * @param {number} y
	 */
	position(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Updates this node's size for rendering purposes.
	 * @param {number} width
	 * @param {number} height
	 */
	resize(width, height) {
		this.width = width;
		this.height = height;
	}

	/**
	 * Returns whether the click coordinates are in the bounds of this node.
	 * @param {number} x 
	 * @param {number} y 
	 */
	isInBounds(x, y) {
		if (this.parent) {
			const [ parentX, parentY ] = this.parentWorldPosition;
	
			x -= parentX - (this.parent.width * 0.5);
			y -= parentY - (this.parent.height * 0.5);
		}

		return (
			x > this.x - (this.width * 0.5) &&
			x < this.x + (this.width * 0.5) &&
			y > this.y - (this.height * 0.5) &&
			y < this.y + (this.height * 0.5)
		);
	}

	/** Draws element to canvas using the 2d rendering context. */
	render() {
		// To be overwritten in child classes
	}
}

