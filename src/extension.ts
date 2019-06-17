import * as vscode from "vscode";
import { constants } from "./constants";
import { PythonRunner } from "./python";
import { consoleInfo } from "./utility";

export function activate(context: vscode.ExtensionContext) {
  consoleInfo(`v${constants.version} activated!`);

	const python = PythonRunner.getInstance(context);

	let disposable = vscode.commands.registerTextEditorCommand(
		"extension.convert", (editor: vscode.TextEditor) => {
			python.convertText(editor.document.getText(editor.selection));
		});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
