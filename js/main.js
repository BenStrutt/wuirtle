"use strict";

import { Logic } from "./Logic.js";
import { Board } from "./ui/Board.js";
import { Keyboard } from "./ui/Keyboard.js";
import { SettingsPanel } from "./ui/SettingsPanel.js";
import { InputManager } from "./InputManager.js";
import { TextBox } from "./ui/TextBox.js";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

context.imageSmoothingEnabled = true;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "#fff5db";

window.onresize = onResize;
document.body.appendChild(canvas);
document.body.style.overflow = "hidden";

const logic = new Logic();
const inputMgr = new InputManager();
const board = new Board();
const keyboard = new Keyboard(logic);
const settingsButton = new TextBox("settings");
const settingsPanel = new SettingsPanel();

board.stroke = false;
keyboard.stroke = false;
settingsPanel.visible = false;

inputMgr.addElement(keyboard);
inputMgr.addElement(settingsButton);
inputMgr.addElement(settingsPanel);

document.addEventListener("mousedown", inputMgr.onMouseDown.bind(inputMgr));
document.addEventListener("touchstart", inputMgr.onTouchStart.bind(inputMgr));
document.addEventListener("touchend", event => event.preventDefault());

// The callbacks passed to these signals would preferably be lambda functions
// passed directly into `receive` but there doesn't seem to be a way to type lambda
// functions with JSDoc so I've thrown standard hoisted function definitions at the
// bottom of this file along with their type definitions.
logic.onLetterPress.receive(onLetterPress);
logic.onEnterPress.receive(onEnterPress);
logic.onBackspacePress.receive(onBackspacePress);

settingsButton.onClick.receive(toggleSettingsPanel);

settingsPanel.onClose.receive(toggleSettingsPanel);

resize();
render();

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	// I promise that I'll make this much easier to parse at some point

	const elementsVerticalMargin = 10;
	const elementsHorizontalMargin = 10;

	const boardHeight = Math.min(height * 0.6, width - (elementsVerticalMargin * 2));
	const keyboardHeight = Math.min(height * 0.3, ((width - (elementsVerticalMargin * 2)) * 0.5));

	board.resize(boardHeight, boardHeight);
	board.position(width * 0.5, height * 0.33);

	keyboard.resize(keyboardHeight * 2, keyboardHeight);
	keyboard.position(width * 0.5, board.y + (board.height * 0.5) + elementsVerticalMargin + (keyboard.height * 0.5));

	const settingsButtonHeight = Math.min(height - (keyboard.y + (keyboard.height * 0.5)) - elementsVerticalMargin, keyboard.height * 0.25);
	settingsButton.resize(keyboard.width * 0.5, settingsButtonHeight);
	settingsButton.position(width * 0.5, keyboard.y + (keyboard.height * 0.5) + (elementsVerticalMargin * 0.5) + (settingsButton.height * 0.5));

	const settingsPanelSize = Math.min(width + elementsHorizontalMargin, height * 0.75);
	settingsPanel.resize(settingsPanelSize, settingsPanelSize);
	settingsPanel.position(width * 0.5, height * 0.5);
}

function render() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	board.render(context);
	keyboard.render(context);
	settingsButton.render(context);
	settingsPanel.render(context);
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

function toggleSettingsPanel() {
	const isVisible = settingsPanel.visible;

	board.visible = isVisible;
	keyboard.visible = isVisible;
	settingsButton.visible = isVisible;

	settingsPanel.visible = !isVisible;

	render();
}