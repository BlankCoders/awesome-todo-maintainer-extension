const vscode = require("vscode");
const axios = require("axios");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log(
		'Congratulations, your extension "awesome-todo-maintainer" is now active!'
	);
	const baseURL = "https://awesome-todo-maintainer.herokuapp.com";

	let readTodo = vscode.commands.registerCommand(
		"awesome-todo-maintainer.readTodos",
		async function () {
			let res = await axios.get(`${baseURL}/readTodo`);
			const rtodos = res.data.map((rtodo) => {
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
	);

	context.subscriptions.push(readTodo);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
