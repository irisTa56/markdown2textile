"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const constants_1 = require("./constants");
const python_1 = require("./python");
function activate(context) {
    console.info(`[${constants_1.constants.name}] v${constants_1.constants.version} activated!`);
    const python = python_1.PythonRunner.getInstance(context);
    let disposable = vscode.commands.registerTextEditorCommand('extension.convert', (editor) => {
        python.convertText(editor.document.getText(editor.selection));
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map