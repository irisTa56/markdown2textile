"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const python_shell_1 = require("python-shell");
const replace_in_file_1 = __importDefault(require("replace-in-file"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
class PythonRunner {
    constructor(context) {
        this.pythonPath = this.getPyConfiguration('pythonPath');
        this.scriptsDir = context.asAbsolutePath('scripts');
        this.runPython('check_version.py');
        this.runPython('check_modules.py');
        // replace shebang of scripts/pandoc_filter.py to the current Python
        const options = {
            files: path.join(this.scriptsDir, 'pandoc_filter.py'),
            from: new RegExp('^#!/.*', 'i'),
            to: `#!${this.pythonPath}`,
        };
        replace_in_file_1.default(options)
            .then((_) => { console.log('Python executable:', this.pythonPath); })
            .catch(error => { console.error(error); });
    }
    static getInstance(context) {
        if (!PythonRunner.instance) {
            PythonRunner.instance = new PythonRunner(context);
        }
        return PythonRunner.instance;
    }
    convertText(text) {
        const pyshell = new python_shell_1.PythonShell(path.join(this.scriptsDir, 'markdown_to_textile.py'), { pythonPath: this.pythonPath });
        pyshell.send(text);
        this.endPython(pyshell);
    }
    runPython(filename) {
        const pyshell = new python_shell_1.PythonShell(path.join(this.scriptsDir, filename), { pythonPath: this.pythonPath });
        this.endPython(pyshell);
    }
    endPython(pyshell) {
        pyshell.on('message', (message) => {
            if (message !== 'OK') {
                vscode.window.showErrorMessage(message);
            }
        }).end((error) => {
            if (error) {
                console.error(error);
            }
        });
    }
    getPyConfiguration(name) {
        const pyConfiguration = vscode.workspace.getConfiguration('python', null);
        // fallback to Homebrewed Python
        return pyConfiguration.get(name, '/usr/local/bin/python3');
    }
}
exports.PythonRunner = PythonRunner;
//# sourceMappingURL=python.js.map