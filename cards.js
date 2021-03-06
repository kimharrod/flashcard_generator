'use strict';

// npm package dependencies
var inquirer = require("inquirer");
var fs = require("fs");

// variables to log a card index and keep track of current card numnber
var cardNum = 1;
var cardIndex = [];


function main () {

// opens and reads number of lines in index file to determine next card number
fs.readFile("card-index.txt", "utf8", function(error, data) {

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


// function to prompt user for basic card creation data
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

	// make a basic card object by passing data to a BasicCard constructor
	var basicCard = new BasicCard(answers.front, answers.back);
	// call storeCard function to add an entry to the card index
	// and store the card as a file
	storeCard(basicCard, basicCard.type, basicCard.front);
	// start over to choose another activity
	main();
	
	}); // end of inquirer callback

} // end basicMenu


// function to prompt user for cloze card creation data 
function clozeMenu () {

inquirer.prompt([
	{
		name: "full",
		message: "Enter the full text for the card:"
	}, {
		name: "cloze",
		message: "Enter the cloze-deletion text for the card:"
	}
]).then(function(answers) {

	// make a cloze card object by passing data to a ClozeCard constructor
	var clozeCard = new ClozeCard(answers.full, answers.cloze);
	//call storeCard function to add an entry to the card index
	// and store the card as a file
	storeCard(clozeCard, clozeCard.type, clozeCard.partial());
	//start over to choose another activity
	main();

}); // end of inquirer callback

} // end clozeMenu


// function to view a card
function viewMenu () {

	// loading two matched arrays - card fronts and corresponding file names
	fs.readFile("card-index.txt", "utf8", function(error,data) {
		if (!error) {

			// split the file data into an array of lines of text
			var indexLines = data.split("\r\n");
			var cardFronts = [];
			var cardNames = [];

			// loop through the array to retrieve the card front info 
			// and corresponding card file name for each index entry
			for (var i=0; i < indexLines.length - 1; i++) {

				 var linePieces = indexLines[i].split('~');
				 
				 // build an array of data to use for the view card prompt menu
				 cardFronts.push(linePieces[2]);
				 
				 // keep track of the file name for each card front
				 cardNames.push(linePieces[0]);

			} // end for loop

		} else {
			 console.log("\nNo cards created yet");
			 main();
		}

		// inquirer prompt for view card menu
		inquirer.prompt([
		  {
			type: 'list',
			name: 'cardChoice',
			message: '\n\nPick a card to view',
			choices: cardFronts
		  }

		  ]).then(function (answers) {

		  	showCard(cardNames[cardFronts.indexOf(answers.cardChoice)]);

		  }); // end inquirer callback
	
	}); // end readFile callback

} // end viewMenu function


// function to show the back side of a selected card
function showCard (name) {

	var cardFile = name + '.json';

	fs.readFile(cardFile, 'utf8', function (err, data) {

		if (err) throw err;

		var cardObj;
		// parse the JSON data to create a javascript object
		cardObj = JSON.parse(data);

		if (cardObj.type === "basic") {
			console.log("Answer: " + cardObj.back + "\n");
		} else {
			console.log("Answer: " + cardObj.cloze + "\n");
		} // end if

		main();

	}); // end readFile callback		

} // end function showCard


// function to store each card created
function storeCard (card, type, top) {

	// create a sequentially numbered card file for each card created
	// containing the json object data for the card
	fs.writeFile('card' + cardNum + '.json', JSON.stringify(card, null, 4), function (err) {
		if (err) throw err;
	});

	// create card index entry
	var indexEntry = 'card' + cardNum + '~' + type + '~' + top + '\r\n';

	// write the entry to the card index file, creating the file if it doesn't already exist
	fs.appendFile('card-index.txt', indexEntry, function (err) {
		if (err) throw err;
	});

} // end function storeCard

// basic card constructor function
// capitalize the name of the function because it is a constructor
function BasicCard (frontText, backText) {

	// conditional to make this constructor scope-safe
	if(!(this instanceof BasicCard)) {
		return new BasicCard(frontText, backText);
	} // end scope-safe if statement

	this.type = "basic";
	this.front = frontText;
	this.back = backText;

} // end BasicCard constructor function


// cloze card constructor function
// capitalize the name of the function because it is a constructor
function ClozeCard (fullText, clozeText) {

	// conditional to make this constructor scope-safe
	if(!(this instanceof ClozeCard)) {
		return new ClozeCard(fullText, clozeText);
	} // end scope-safe if statement

	this.type = "cloze";
	this.full = fullText;
	this.cloze = clozeText;

} // end ClozeCard constructor function


// prototype to add method to cloze card object to derive partial text
ClozeCard.prototype.partial = function() {

	if (this.full.includes(this.cloze) === true) {
		 var partialText = this.full.replace(this.cloze, "...");
		 return partialText;

	} else {

		// display error message in terminal 
		console.log("cloze mismatch error");
		// error text gets written to index file
		return "cloze mismatch error";

	} // end if cloze not included in full

}; // end ClozeCard.prototype.partial function

main();

