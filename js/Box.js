"use strict";

export class Box {
	name = "Ben";
	#number = 0;

	printA() {
		console.log(this.name);
		console.log(this.#number);
	}
}
