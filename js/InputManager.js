"use strict";

import { RenderNode } from "./ui/RenderNode.js";

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

	/** @param {MouseEvent} eventData Browser data from mouse down event */
	onMouseDown(eventData) {
		const { x, y } = eventData;

		this._checkElementsForEmission(x, y);
	}

	/** @param {TouchEvent} eventData */
	onTouchStart(eventData) {
		const { pageX, pageY } = eventData.touches.item(0);

		this._checkElementsForEmission(pageX, pageY);
	}

	/**
	 * Checks each element that has been added to this input manager to see
	 * whether the node needs to be emitted or to have its children iterated over.
	 * @param {number} x
	 * @param {number} y
	 */
	_checkElementsForEmission(x, y) {
		for (const element of this.#uiElements) {
			if (!element.visible) { continue; }

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