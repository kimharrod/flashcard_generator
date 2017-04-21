'use strict';

// npm package dependencies
var inquirer = require("inquirer");
var fs = require("fs");

// variables to log a card index and keep track of current card numnber
var cardNum = 1;
var cardIndex = [];


function main () {

// opens and reads number of lines in index file to determine next card number
fs.readfile("card-index.txt", "utf8", function(error, data) {

		// first check to see if a card index file already exists
		if (!error) {
			var indexLines = data.split("\n");
			cardNum = indexLines.length;
		} // end if card-index.txt file exists
	}); // end readFile callback

// use inquirer to prompt user to choose the application activity path
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

// use switch statement to invoke a function depending on activity choice
]).then(function (answers) {

	switch (answers.activity) {

		case 'Basic Card':
			basicMenu();
		break;


		case 'Cloze Card':
			clozeMenu();
		break;


		case 'View a Card':
			viewMenu();
		break;


		case 'Exit':
			console.log("Thanks! Please come again.");
		break;


		default:
			return;

	} //end switch

  }); // end inquirer callback

} //end function main

// prompt user for card creation data
function basicMenu () {

	inquirer.prompt([
		{
			name: "front",
			message: "Enter the text for the card front:"
		}, {
			name: "back",
			message: "Enter the text for the card back:"
		}
	]).then(function(answers) {

	// make a card object by passing the data to a BasicCard constructor
	var basicCard = new BasicCard(answers.front, answers.back);
	// call storeCard function to add an entry to the card index
	// and store each card as a file
	storeCard(basicCard, basicCard.type, basicCard.front);
	// start over to choose another activity
	main();
	
	});

} // end basicMenu

