"use strict";

/**
 * A node script to generate js files containing exported string arrays
 * from .txt files that contain a list of words seperated by newline characters.
 * 
 * The script takes 2 command line arguments.
 * 1st: The path to the input .txt file.
 * 2nd: What to name the exported array.
 * 
 * The output file will be automatically written to the site/js/generated folder
 * and will be named the same as the exported array name.
 */

const fsPromises = require('fs').promises;
const encoding = "utf8";

if (process.argv.length !== 4) { error("Incorrect number of arguments"); }
const [ inputPath, arrName ] = process.argv.slice(2);

async function generate() {
	const time = process.hrtime();
	let wordArr;

	await fsPromises.readFile(inputPath, encoding).then((data) => {
		wordArr = data.split("\n").map(word => '"' + word.trim().toLowerCase() + '"');
	});

	await fsPromises.writeFile(
		`../../js/generated/${arrName}.js`,
		`export const ${arrName} = [${wordArr.join(",")}];`
	);

	console.log(`Generation time: ${process.hrtime(time)[0]} seconds`);
}

function error(message) { throw new Error(message); }

generate();