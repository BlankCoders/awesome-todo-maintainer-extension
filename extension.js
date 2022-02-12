const vscode = require("vscode");
const axios = require("axios");
const baseURL = "https://awesome-todo-maintainer.herokuapp.com";

let errorPrompt = async () => {
	let dbID = await getDbId();
	if (dbID.length > 0) {
		read(baseURL, dbID);
	}
	return dbID;
};

// let title = await vscode.window.showInputBox({
// 	ignoreFocusOut: true,
// 	prompt: `Enter your TODO title.`,
// });
// let priority = await vscode.window.showInputBox({
// 	ignoreFocusOut: true,
// 	prompt: `Enter your TODO title.`,
// });
// let status = await vscode.window.showInputBox({
// 	ignoreFocusOut: true,
// 	prompt: `Enter your TODO title.`,
// });
// let remarks = await vscode.window.showInputBox({
// 	ignoreFocusOut: true,
// 	prompt: `Enter your TODO title.`,
// });

// axios.post(`${baseURL}/create?databaseID=${dbID}`, {
// 	firstName: 'Fred',
// 	lastName: 'Flintstone'
//   })
//   .then(function (response) {
// 	console.log(response);
//   })
//   .catch(function (error) {
// 	console.log(error);
//   });

const create = async (baseURL, dbID) => {
	let res = await axios.get(`${baseURL}/readTodo?databaseID=${dbID}`);
	if (res.status !== 200) {
		const message = "Service down.";
		vscode.window.showInformationMessage(message);
	}
	let priorities = new Array();
	res.data.map((ptodo) => {
		priorities.push(ptodo.priority);
	});

	priorities = [...new Set(priorities)];
	// console.log(priorities);

	const ptodo = await vscode.window.showQuickPick(priorities, {
		matchOnDescription: true,
	});

	if (ptodo) {
		console.log(ptodo);
	} else {
		return;
	}
};

const read = async (baseURL, dbID) => {
	let res = await axios.get(`${baseURL}/readTodo?databaseID=${dbID}`);
	if (res.data.success === "false" || !res.data.success) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		errorPrompt();
		return;
	}

	const rtodos = res.data.results.map((rtodo) => {
		return {
			label: rtodo.title,
			detail: `${rtodo.priority} - ${rtodo.status}`,
			description: rtodo.remarks,
			link: rtodo.url,
		};
	});

	const rtodo = await vscode.window.showQuickPick(rtodos, {
		matchOnDescription: true,
	});

	if (rtodo) {
		vscode.env.openExternal(rtodo.link);
	} else {
		return;
	}
};

const getDbId = async () => {
	let dbID = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: `Enter your NOTION Database URL. \n Eg.: https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...`,
	});

	if (dbID.indexOf("?") === -1) {
		dbID = dbID.slice(-32);
	} else {
		dbID = dbID.slice(dbID.indexOf("?") - 32, dbID.indexOf("?"));
	}

	console.log(dbID);

	return dbID;
};

const check = async (baseURL, dbID) => {
	let res = await axios.get(`${baseURL}/?databaseID=${dbID}`);
	if (res.data.success === "false" || !res.data.success) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		dbID = await getDbId(baseURL);
	}
	const message = "Database added in workspace.";
	vscode.window.showInformationMessage(message);
	return dbID;
};

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
	console.log(
		'Congratulations, your extension "awesome-todo-maintainer" is now active!'
	);

	let dbID = await getDbId();

	let configureDb = vscode.commands.registerCommand(
		"awesome-todo-maintainer.configureDB",
		async function () {
			dbID = await getDbId(baseURL);

			if (!dbID || dbID.length === 0) {
				return;
			}

			if (dbID) {
				dbID = await check(baseURL, dbID);
			}
		}
	);

	let readTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.readTodos",
		async function () {
			if (!dbID || dbID.length === 0) {
				dbID = errorPrompt();
			} else {
				read(baseURL, dbID);
			}
		}
	);

	let createTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.createTodos",
		async function () {
			if (!dbID || dbID.length === 0) {
				errorPrompt();
			} else {
				create(baseURL, dbID);
			}
		}
	);

	context.subscriptions.push(configureDb, readTodo, createTodo);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
