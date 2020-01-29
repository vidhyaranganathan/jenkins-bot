const { ux } = require('@cto.ai/sdk');
const { OPERATIONS } = require('../constants');

const { white, reset } = ux.colors;

const inputPrompts = [
	{
		type: 'input',
		name: 'email',
		message: 'Type input here',
	},
	{
		type: 'password',
		name: 'password',
		message: 'Enter password here',
	},
];

const listPrompt = {
	type: 'list',
	name: 'list',
	message: `\nWhat impact is the incident having ${reset.green('→')}`,
	choices: [
		'All customers are affected.',
		'Large segment of customers are affected.',
		'Small segment of customers are affected.',
		'Site performance degraded for some customers.',
		'Potential issue, but customers are currently unaware.',
		'All customers are affected.',
		'Large segment of customers are affected.',
		'Small segment of customers are affected.',
		'Site performance degraded for some customers.',
		'All customers are affected.',
		'Large segment of customers are affected.',
		'Small segment of customers are affected.',
		'Site performance degraded for some customers.',
	],
};

const confirmPrompt = {
	type: 'confirm',
	name: 'confirm',
	message: `Is the incident closed ${reset.green('→')}`,
};

const continuePrompt = {
	type: 'input',
	name: 'continue',
	message: `Press enter to continue →`,
	allowEmpty: true,
};

const fuzzySearchPrompt = {
	type: 'autocomplete',
	name: 'autocomplete',
	message: `Select a state to travel from ${reset.green('→')} `,
	autocomplete: OPERATIONS,
};

const datePickerPrompt = {
	type: 'datetime',
	name: 'datepicker',
	message: `\nWhen are you going ${reset.green('→')}`,
	variant: 'datetime',
};

module.exports = {
	inputPrompts,
	listPrompt,
	confirmPrompt,
	continuePrompt,
	fuzzySearchPrompt,
	datePickerPrompt,
};
