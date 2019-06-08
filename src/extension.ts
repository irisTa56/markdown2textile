import * as vscode from 'vscode';
import { constants } from './constants';
import { PythonRunner } from './python';

export function activate(context: vscode.ExtensionContext) {
  console.info(`[${constants.name}] v${constants.version} activated!`);

	const python = PythonRunner.getInstance(context);
	python.checkPythonVersion();
	python.checkPythonModules();

	let disposable = vscode.commands.registerTextEditorCommand(
		'extension.convert', (editor: vscode.TextEditor) => {
			python.convertText(editor.document.getText(editor.selection));
		});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
