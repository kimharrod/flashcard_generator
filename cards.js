'use strict';

// npm package dependencies
var inquirer = require("inquirer");
var fs = require("fs");

// variables to log a card index and keep track of current card numnber
var cardNum = 1;
var cardIndex = [];

// use inquirer to prompt user to choose the application activity path
function main () {

// opens and reads number of lines in index file to determine next card number
fs.readfile("card-index.txt", "utf8", function(error, data) {

		// first check to see if a card index file already exists
		if (!error) {
			var indexLines = data.split("\n");
			cardNum = indexLines.length;
		} // end if card-index.txt file exists
	}); // end readFile callback

inquirer.prompt([
	{
		type: 'list',
		name: 'activity',
		message: 'What kind of card do your want to create?',
		choices: [
			new inquirer.Separator(),
			'Basic Card',
			'Cloze Card',
			new inquirer.Separator(),
			'View a Card',
			new inquirer.Separator(),
			'Exit'
		]
	}
]).then(function (answers) {

	switch (answers.activity) {

		case 'Create a Basic Card':
			basicMenu();
		break;


		case 'Create a Cloze Card':
			clozeMenu();
		break;


		case 'View a Card':
			viewMenu();
		break;


		case 'Exit':
			console.log("Exit selected");
		break;


		default:
			return;

	} //end switch

  });

} //end function main

