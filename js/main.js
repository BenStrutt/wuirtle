"use strict";

import { Trie } from "./Trie/Trie.js";

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

context.imageSmoothingEnabled = true;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 5;
canvas.style.backgroundColor = "#fff5db";

document.body.appendChild(canvas);

context.fillStyle = "blue";
context.fillRect(50, 50, 150, 150);

const dictionary = new Trie();
dictionary.load(["apple", "blue", "cat", "dummy"]);
console.log(`isValidWord(apple): ${dictionary.isValidWord("apple")}`);
console.log(`isValidWord(dummy): ${dictionary.isValidWord("dummy")}`);
console.log(`isValidWord(jerk): ${dictionary.isValidWord("jerk")}`);
console.log(`isValidWord(blu): ${dictionary.isValidWord("blu")}`);
