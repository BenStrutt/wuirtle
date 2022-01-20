"use strict";

import { RenderNode } from "./objects/RenderNode.js";

export class InputManager {
	/** @type {RenderNode[]} */
	#uiElements = [];

	/**
	 * Adds an element for the input manager to check against.
	 * @param {RenderNode} element 
	 */
	addElement(element) {
		this.#uiElements.push(element);
	}

	/** @param {MouseEvent} ev Browser data from mouse down event */
	onMouseDown(ev) {
		const { x, y } = ev;

		for (const element of this.#uiElements) {
			if (element.isInBounds(x, y)) {
				const toReturn = this._emitChildren(element, x, y);

				if (toReturn) { return; }
			}
		}
	}

	/**
	 * @private
	 * @param {RenderNode} element
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	_emitChildren(element, x, y) {
		if (element.children.length > 0) {
			for (const child of element.children) {
				const toReturn = this._emitChildren(child, x, y);

				if (toReturn) { return true; }
			}

			return false;
		}

		if (element.isInBounds(x, y)) {
			element.onClick.emit();
			return true;
		}

		return false;
	}
}