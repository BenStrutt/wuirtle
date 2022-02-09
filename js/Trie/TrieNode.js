"use strict";

/** @typedef {Object} TrieNodeChildren */

export class TrieNode {
	/**
	 * An object to hold children nodes.
	 * If a child exists, its key will be a character
	 * 'a' through 'z' and its value will be a TrieNode.
	 * @type {TrieNodeChildren}
	 */
	#children = {};

	/**
	 * Whether this node marks the end of a word.
	 * @type {boolean}
	 */
	#isLeaf;

	/**
	 * @constructor
	 * @param {boolean} isLeaf Whether this node is a leaf node.
	 */
	constructor(isLeaf) {
		this.#isLeaf = isLeaf;
	}

	/**
	 * Getter for `TrieNode`'s private `#isLeaf` property.
	 * @type {boolean} Whether this node marks the end of a word.
	 */
	get isLeaf() {
		return this.#isLeaf;
	}

	/**
	 * @param {string} char The character against which to check.
	 * @returns {TrieNode | undefined} The child TrieNode corresponding to `char`, or `undefined`.
	 */
	getChild(char) {
		if (char.length > 1) {
			console.warn("[WARNING] string of length > 1 passed to TrieNode#getChild");
		}

		return this.#children[char];
	}

	/**
	 * @param {string} char The character for which to add to list of existing children.
	 * @param {boolean} isLeaf Whether the added node marks the end of a word.
	 */
	addChild(char, isLeaf) {
		if (char.length > 1) {
			console.warn("[WARNING] string of length > 1 passed to TrieNode#addChild");
		}

		this.#children[char] = new TrieNode(isLeaf);
	}

	/**
	 * @param {string} char The character against which to check for a corresponding child node.
	 * @returns {boolean} Whether the node exists.
	 */
	hasChild(char) {
		if (char.length > 1) {
			console.warn("[WARNING] string of length > 1 passed to TrieNode#hasChild");
		}

		const child = this.getChild(char);
		return child instanceof TrieNode;
	}
}

