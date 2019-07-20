import * as vscode from "vscode";
import { constants } from "./constants";
import { PythonRunner } from "./python";
import { consoleInfo } from "./utility";

export function activate(context: vscode.ExtensionContext) {
  consoleInfo(`v${constants.version} activated!`);

	const python = PythonRunner.getInstance(context);

	context.subscriptions.push(vscode.commands.registerTextEditorCommand(
		"markdown2textile.convertText", (editor: vscode.TextEditor) => {
			python.convertText(editor.document.getText(editor.selection));
		}));

	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(
		(event: vscode.ConfigurationChangeEvent) => {
			if (event.affectsConfiguration("markdown2textile.pythonPathToUsePandoc")) {
				python.updatePythonPath();
			}
		}));
}

export function deactivate() {}
