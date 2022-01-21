"use strict";

import { TextBox } from "./TextBox.js";
import { Signal } from "../util/Signal.js";

export class RevealPanel extends TextBox {
	onClose = new Signal();
	#closeButton = new TextBox();

	constructor() {
		super();

		this.addChild(this.#closeButton);
		this.#closeButton.text = "close";
		this.#closeButton.onClick.receive(() => this.onClose.emit());
	}

	resize(width, height) {
		super.resize(width, height);

		this.#closeButton.resize(this.width * 0.5, this.height * 0.1);
		this.#closeButton.position(
			this.width * 0.5, 
			this.height - (this.#closeButton.height * 0.5) - 10,
		);
	}

	render(context) {
		if (!this.visible) { return; }

		super.render(context);

		this.#closeButton.render(context);
	}
}