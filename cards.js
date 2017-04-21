var inquirer = require("inquirer");
var fs = require("fs");

function main () {
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

}