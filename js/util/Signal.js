"use strict";

/**
 * I have no idea how to type these class properties with JSDoc.
 */
export class Signal {
	#listeners = [];

	emit(...args) {
		this.#listeners.forEach(listener => listener(...args));
	}

	receive(callback) {
		this.#listeners.push(callback);
	}
}