"use strict";

import { TrieNode } from "./TrieNode.js";

export class Trie {
	/**
	 * The root node of this Trie structure.
	 * @type {TrieNode}
	 */
	#rootNode;

	/**
	 * @constructor
	 * @param {string[]} words An array of words to be loaded into this Trie.
	 */
	constructor(words = []) {
		if (words.length === 0) {
			this.#rootNode = new TrieNode(false);
			return;
		}

		this.load(words);
	}
	/**
	 * Loads a list of words into this Trie.
	 * @param {string[]} words An array of words to be loaded.
	 */
	load(words) {
		this.#rootNode = new TrieNode(false);

		/**
		 * This variable will store our current node as we walk down the tree.
		 * @type {TrieNode}
		 */
		let currentNode;

		for (let i = 0; i < words.length; i++) {
			const word = words[i];
			currentNode = this.#rootNode;

			for (let ii = 0; ii < word.length; ii++) {
				const char = word[ii];

				if (!currentNode.hasChild(char)) {
					const isLeafNode = ii === word.length - 1;
					currentNode.addChild(char, isLeafNode);
				}

				currentNode = currentNode.getChild(char);

				if (currentNode === undefined) {
					console.warn("[WARNING] currentNode is undefined in Trie::load");
					console.warn("[WARNING] failed to load trie");
					return;
				}
			}
		}
	}

	/**
	 * @param {string} word The word to be validated.
	 * @returns {boolean} Whether the word exists in the Trie.
	 */
	isValidWord(word) {
		let currentNode = this.#rootNode;

		for (let i = 0; i < word.length; i++) {
			const character = word[i];
			const childNode = currentNode.getChild(character);

			if (childNode === undefined) { return false; }

			currentNode = childNode;
		}

		return currentNode.isLeaf;
	}
}

