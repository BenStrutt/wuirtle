"use strict";

import { Logic } from "./Logic.js";
import { Board } from "./objects/Board.js";
import { Keyboard } from "./objects/Keyboard.js";
import { InputManager } from "./InputManager.js";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

context.imageSmoothingEnabled = true;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 5;
canvas.style.backgroundColor = "#fff5db";

window.onresize = onResize;
document.body.appendChild(canvas);

const logic = new Logic();
const inputMgr = new InputManager();
const board = new Board();
const keyboard = new Keyboard(logic);

inputMgr.addElement(keyboard);

document.addEventListener("mousedown", inputMgr.onMouseDown.bind(inputMgr));

// The callbacks passed to these signals would preferably be lambda functions
// passed directly into `receive` but there doesn't seem to be a way to type lambda
// functions with JSDoc so I've thrown standard hoisted function definitions at the
// bottom of this file along with their type definitions.
logic.onLetterPress.receive(onLetterPress);
logic.onEnterPress.receive(onEnterPress);
logic.onBackspacePress.receive(onBackspacePress);

resize();
render();

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight - 5;

	canvas.width = width;
	canvas.height = height;

	const widthMargin = 10;
	const boardHeight = Math.min(height * 0.6, width - (widthMargin * 2));
	const keyboardHeight = Math.min(height * 0.3, ((width - (widthMargin * 2)) * 0.5));

	board.resize(boardHeight, boardHeight);
	board.position(width * 0.5, height * 0.33);

	keyboard.resize(keyboardHeight * 2, keyboardHeight);
	keyboard.position(width * 0.5, height * 0.8);
}

function render() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	board.render(context);
	keyboard.render(context);
}

function onResize() {
	resize();
	render();
}

/**
 * @callback onLetterPressCallback
 * @param {(string | undefined)} letter
 * @returns {void}
 */

/** @type {onLetterPressCallback} */
function onLetterPress(letter) {
	if (letter === undefined) {
		// board.shake();
		// TODO: write the animation function to indicate illegal move
		return;
	}

	board.addLetter(letter);
	render();
}

/**
 * @callback onEnterPressCallback
 * @param {string} word
 * @returns {void}
 */

/** @type {onEnterPressCallback} */
function onEnterPress(word, guess) {
	board.reveal(word);
	keyboard.reveal(word, guess);
	render();
}

/**
 * @callback onBackspacePressCallback
 * @returns {void}
 */

/** @type {onBackspacePressCallback} */
function onBackspacePress() {
	board.removeLetter();
	render();
}