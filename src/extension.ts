import * as vscode from "vscode";
import { constants } from "./constants";
import { PythonRunner } from "./python";
import { consoleInfo } from "./utility";

export function activate(context: vscode.ExtensionContext) {
  consoleInfo(`v${constants.version} activated!`);

	const python = PythonRunner.getInstance(context);

	let convert = vscode.commands.registerTextEditorCommand(
		"extension.convertText", (editor: vscode.TextEditor) => {
			python.convertText(editor.document.getText(editor.selection));
		});

	context.subscriptions.push(convert);

	let select = vscode.commands.registerTextEditorCommand(
		"extension.selectPythonInterpreter", () => {
			python.selectPythonInterpreter();
		});

		context.subscriptions.push(select);
}

export function deactivate() {}
