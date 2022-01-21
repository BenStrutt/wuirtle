"use strict";

import { Logic, MoveType } from "./Logic.js";
import { Board } from "./ui/Board.js";
import { Keyboard } from "./ui/Keyboard.js";
import { SettingsPanel } from "./ui/SettingsPanel.js";
import { InputManager } from "./InputManager.js";
import { TextBox } from "./ui/TextBox.js";

// Set up the canvas and 2d rendering context.
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

// Set our initial canvas/context properties.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.backgroundColor = "#fff5db";
context.imageSmoothingEnabled = true;

// Set our initial window/document properties.
window.onresize = onResize;
document.body.appendChild(canvas);
document.body.style.overflow = "hidden";

// Initialize instances of game logic and ui elements.
const logic = new Logic();
const inputMgr = new InputManager();
const board = new Board();
const keyboard = new Keyboard(logic);
const settingsButton = new TextBox("settings");
const settingsPanel = new SettingsPanel();
const replayButton = new TextBox("replay");
const revealButton = new TextBox("reveal")

// Set out initial ui element properties.
board.stroke = false;
keyboard.stroke = false;
settingsPanel.visible = false;

// Add our interactive ui elements to our input manager.
inputMgr.addElement(keyboard);
inputMgr.addElement(settingsButton);
inputMgr.addElement(settingsPanel);
inputMgr.addElement(replayButton);
inputMgr.addElement(revealButton);

// Register document event listeners
document.addEventListener("mousedown", inputMgr.onMouseDown.bind(inputMgr));
document.addEventListener("touchstart", inputMgr.onTouchStart.bind(inputMgr));
document.addEventListener("touchend", event => event.preventDefault());

// Register all signal listeners.
// The callbacks passed to these signals would preferably be lambda functions
// passed directly into `receive` but there doesn't seem to be a way to type lambda
// functions with JSDoc so I've thrown standard hoisted function definitions at the
// bottom of this file along with their type definitions.
logic.onLetterPress.receive(onLetterPress);
logic.onEnterPress.receive(onEnterPress);
logic.onBackspacePress.receive(onBackspacePress);
logic.onReplayPress.receive(onReplayPress);
logic.onRevealPress.receive(onRevealPress);

settingsButton.onClick.receive(toggleSettingsPanel);
settingsPanel.onClose.receive(toggleSettingsPanel);
replayButton.onClick.receive(() => logic.input(MoveType.PressReplay));
revealButton.onClick.receive(() => logic.input(MoveType.PressReveal));

// Resize elements to window dimensions and render ui elements.
resize();
render();

/**
 * Resizes and positions all ui elements relative to the window size.
 */
function resize() {
	// I promise that I'll make this much easier to parse at some point
	const width = window.innerWidth;
	const height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	const elementsVerticalMargin = 10;

	const boardHeight = Math.min(height * 0.6, width - (elementsVerticalMargin * 2));
	const keyboardHeight = Math.min(height * 0.3, ((width - (elementsVerticalMargin * 2)) * 0.5));

	board.resize(boardHeight, boardHeight);
	board.position(width * 0.5, height * 0.33);

	keyboard.resize(keyboardHeight * 2, keyboardHeight);
	keyboard.position(width * 0.5, board.y + (board.height * 0.5) + elementsVerticalMargin + (keyboard.height * 0.5));

	const settingsButtonHeight = Math.min(height - (keyboard.y + (keyboard.height * 0.5)) - elementsVerticalMargin, keyboard.height * 0.25);
	settingsButton.resize(keyboard.width * 0.33, settingsButtonHeight);
	settingsButton.position(width * 0.5, keyboard.y + (keyboard.height * 0.5) + (elementsVerticalMargin * 0.5) + (settingsButton.height * 0.5));

	const settingsPanelSize = Math.min(width, height * 0.75);
	settingsPanel.resize(settingsPanelSize - 10, settingsPanelSize - 10);
	settingsPanel.position(width * 0.5, height * 0.5);

	const revealBtnWidth = settingsButton.width * 0.5;
	const revealBtnX = keyboard.x - (keyboard.width * 0.5) + (revealBtnWidth * 0.5);
	revealButton.resize(revealBtnWidth, settingsButton.height);
	revealButton.position(revealBtnX, settingsButton.y);

	const replayBtnWidth = settingsButton.width * 0.5;
	const replayBtnX = keyboard.x + (keyboard.width * 0.5) - (replayBtnWidth * 0.5);
	replayButton.resize(replayBtnWidth, settingsButton.height);
	replayButton.position(replayBtnX, settingsButton.y);
}

/**
 * Renders all ui elements. Might have a stage manager later that handles all this.
 */
function render() {
	context.clearRect(0, 0, window.innerWidth, window.innerHeight);

	board.render(context);
	keyboard.render(context);
	settingsButton.render(context);
	settingsPanel.render(context);
	revealButton.render(context);
	replayButton.render(context);
}

/**
 * Called when the window object fires a resize event.
 */
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

/**
 * @callback toggleSettingsPanelCallback
 * @returns {void}
 */

 /** @type {toggleSettingsPanelCallback} */
function toggleSettingsPanel() {
	const isVisible = settingsPanel.visible;

	board.visible = isVisible;
	keyboard.visible = isVisible;
	settingsButton.visible = isVisible;
	replayButton.visible = isVisible;
	revealButton.visible = isVisible;

	settingsPanel.visible = !isVisible;

	render();
}

/**
 * @callback onReplayPressCallback
 * @returns {void}
 */

 /** @type {onReplayPressCallback} */
function onReplayPress() {
	board.reset();
	keyboard.reset();

	render();
}

/**
 * @callback onRevealPressCallback
 * @returns {void}
 */

 /** @type {onRevealPressCallback} */
function onRevealPress() {

}