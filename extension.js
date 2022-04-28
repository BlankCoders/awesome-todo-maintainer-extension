const vscode = require("vscode");
const axios = require("axios");
const baseURL = "https://awesome-todo-maintainer.herokuapp.com";
let gDBID = null;
let NOTION_KEY = ""
const priorityList = ["Low👀", "Medium💻", "High🚀"];
const statusList = ["Completed🚀", "In Progress💻", "Scheduled👀"];

const getKey = async () => {
	let key = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: `Enter your NOTION Integration Key`,
	});
	if (!key || key === "") {
		return;
	}
	else {
		NOTION_KEY = key;
	}
}

const getDbId = async () => {
	let dbID = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: `Enter your NOTION Database URL. Eg.: https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...`,
	});

	if (!dbID || dbID === "") {
		return;
	}
	if (dbID.indexOf("?") === -1) {
		dbID = dbID.slice(-32);
	} else {
		dbID = dbID.slice(dbID.indexOf("?") - 32, dbID.indexOf("?"));
	}
	if (await check(baseURL, dbID, NOTION_KEY)) {
		gDBID = dbID;
	} else {
		await getDbId();
	}
};

const check = async (baseURL, dbID, NOTION_KEY) => {
	let res = await axios.get(`${baseURL}/?databaseID=${dbID}&NOTION_KEY=${NOTION_KEY}`);
	if (res.data.success === "false" || !res.data.success) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		return false;
	}
	const message = "Database added in workspace.";
	vscode.window.showInformationMessage(message);
	return true;
};

const create = async (baseURL, gDBID) => {
	if (!gDBID) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		await getDbId();
	} else {
		let res = await axios.get(`${baseURL}/readTodo?databaseID=${gDBID}&NOTION_KEY=${NOTION_KEY}`);

		let title = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "Add a TO-DO title.",
		});

		const ptodo = await vscode.window.showQuickPick(priorityList, {
			matchOnDescription: true,
			title: "Priority of TO-DO:",
		});

		if (ptodo) {
			priority = ptodo;
		} else {
			return;
		}

		const stodo = await vscode.window.showQuickPick(statusList, {
			matchOnDescription: true,
			title: "Status of TO-DO:",
		});

		if (stodo) {
			status = stodo;
		} else {
			return;
		}

		let remarks = await vscode.window.showInputBox({
			ignoreFocusOut: true,
			prompt: "Add remarks.",
		});

		let responseBe = {
			title: title,
			priority: priority,
			status: status,
			remarks: remarks,
		};

		axios
			.post(`${baseURL}/createTodo?databaseID=${gDBID}`, responseBe)
			.then(vscode.window.showInformationMessage("To-Do added."));
	}
};

const read = async (baseURL, gDBID) => {
	if (!gDBID) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		await getDbId();
	} else {
		let res = await axios.get(`${baseURL}/readTodo?databaseID=${gDBID}&NOTION_KEY=${NOTION_KEY}`);

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
	}
};

const update = async (baseURL, gDBID) => {
	if (!gDBID) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		await getDbId();
	} else {
		let res = await axios.get(`${baseURL}/readTodo?databaseID=${gDBID}&NOTION_KEY=${NOTION_KEY}`);

		const rtodos = res.data.results.map((rtodo) => {
			return {
				label: rtodo.title,
				detail: `${rtodo.priority} - ${rtodo.status}`,
				description: rtodo.remarks,
				pageID: rtodo.pageID,
			};
		});

		const rtodo = await vscode.window.showQuickPick(rtodos, {
			matchOnDescription: true,
		});

		if (rtodo) {
			let title = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				prompt: "Add a TO-DO title.",
				value: rtodo.label,
			});

			const ptodo = await vscode.window.showQuickPick(priorityList, {
				matchOnDescription: true,
				title: "Priority of TO-DO:",
			});

			if (ptodo) {
				priority = ptodo;
			} else {
				return;
			}

			const stodo = await vscode.window.showQuickPick(statusList, {
				matchOnDescription: true,
				title: "Status of TO-DO:",
			});

			if (stodo) {
				status = stodo;
			} else {
				return;
			}

			let remarks = await vscode.window.showInputBox({
				ignoreFocusOut: true,
				value: rtodo.description,
				prompt: "Add remarks.",
			});

			const data = JSON.stringify({
				pageID: rtodo.pageID,
				title: title,
				priority: priority,
				status: status,
				remarks: remarks,
			});

			const config = {
				method: "put",
				url: `${baseURL}/updateTodo`,
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			};

			axios(config)
				.then(function () {
					vscode.window.showInformationMessage("To-Do updated.");
				})
				.catch(function () {
					vscode.window.showErrorMessage("Process failed.");
				});
		} else {
			return;
		}
	}
};

const deletes = async (baseURL, gDBID) => {
	if (!gDBID) {
		const message = "Database not found.";
		vscode.window.showErrorMessage(message);
		await getDbId();
	} else {
		let res = await axios.get(`${baseURL}/readTodo?databaseID=${gDBID}&NOTION_KEY=${NOTION_KEY}`);

		const rtodos = res.data.results.map((rtodo) => {
			return {
				label: rtodo.title,
				detail: `${rtodo.priority} - ${rtodo.status}`,
				description: rtodo.remarks,
				pageID: rtodo.pageID,
			};
		});

		const rtodo = await vscode.window.showQuickPick(rtodos, {
			matchOnDescription: true,
		});

		if (rtodo) {
			const data = JSON.stringify({
				pageID: rtodo.pageID,
			});

			const config = {
				method: "delete",
				url: `${baseURL}/deleteTodo`,
				headers: {
					"Content-Type": "application/json",
				},
				data: data,
			};

			axios(config)
				.then(function () {
					vscode.window.showInformationMessage("To-Do deleted.");
				})
				.catch(function () {
					vscode.window.showErrorMessage("Process failed.");
				});
		} else {
			return;
		}
	}
};

/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
	console.log(
		'Congratulations, your extension "awesome-todo-maintainer" is now active!'
	);

	await getKey();
	// await getDbId();

	let configureDb = vscode.commands.registerCommand(
		"awesome-todo-maintainer.configureDB",
		async function () {
			await getDbId();
		}
	);

	let readDb = vscode.commands.registerCommand(
		"awesome-todo-maintainer.readDB",
		function () {
			vscode.window.showInformationMessage(
				gDBID ? `Current database: ${gDBID}` : "No database found."
			);
		}
	);

	let readTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.readTodos",
		async function () {
			await read(baseURL, gDBID);
		}
	);

	let createTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.createTodos",
		async function () {
			await create(baseURL, gDBID);
		}
	);

	let deleteTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.deleteTodos",
		async function () {
			await deletes(baseURL, gDBID);
		}
	);

	let updateTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.updateTodos",
		async function () {
			await update(baseURL, gDBID);
		}
	);

	let readToken = vscode.commands.registerCommand(
		"awesome-todo-maintainer.getToken",
		async function () {
			await getToken(baseURL, gDBID);
		}
	);

	context.subscriptions.push(
		configureDb,
		readDb,
		readTodo,
		createTodo,
		updateTodo,
		deleteTodo,
		readToken
	);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate,
};
