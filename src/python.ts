import { PythonShell } from "python-shell";
import replaceInFile, { ReplaceInFileConfig } from "replace-in-file";
import * as path from "path";
import * as vscode from "vscode";
import { consoleInfo, showError } from "./utility";

type PyShellReturn = Thenable<string | Error | undefined>;

export class PythonRunner {
  private scriptsDir: string;
  private pythonPath: string;
  private static instance: PythonRunner;

  private constructor(context: vscode.ExtensionContext) {
    this.scriptsDir = context.asAbsolutePath("scripts");
    this.pythonPath = PythonRunner.getPythonPath();
    this.checkPythonVersion()
      .then(() => { consoleInfo(`Python is ${this.pythonPath}`); })
      .then(() => this.checkPythonModules())
      .then(() => { consoleInfo(`Required Python modules are OK!`); })
      .then(() => {
        // replace shebang of scripts/pandoc_filter.py to the current Python
        const options: ReplaceInFileConfig = {
          files: path.join(this.scriptsDir, "pandoc_filter.py"),
          from: new RegExp("^#!/.*", "i"),
          to: `#!${this.pythonPath}`,
        };
        replaceInFile(options).catch(showError);
      })
      .then(undefined, showError);
  }

  public static getInstance(context: vscode.ExtensionContext): PythonRunner {
    if (!PythonRunner.instance) {
      PythonRunner.instance = new PythonRunner(context);
    }
    return PythonRunner.instance;
  }

  private static getPythonPath(): string {
    const pyConfiguration = vscode.workspace.getConfiguration("python", null);
    // fallback to System Python
    return pyConfiguration.get<string>("pythonPath", "/usr/bin/python");
  }

  private static commWithPython(
      pyshell: PythonShell, textToPython?: string): PyShellReturn {
    return new Promise((resolve, reject) => {
      if (typeof textToPython === "string") { pyshell.send(textToPython); }
      pyshell.on("message", (message: string) => { reject(message); });
      pyshell.end((error: Error) => {
        if (error) { reject(error); }
        else { resolve(); }
      });
    });
  }

  private makePythonShell(script: string, option?: object): PythonShell {
    return new PythonShell(
      path.join(this.scriptsDir, script),
      option || { pythonPath: this.pythonPath });
  }

  public convertText(text: string): void {
    const pyshell = this.makePythonShell("markdown_to_textile.py");
    PythonRunner.commWithPython(pyshell, text).then(undefined, showError);
  }

  private checkPythonVersion(): PyShellReturn {
    return this.checkPython(
      "check_version.py", this.selectCompatiblePython.bind(this));
  }

  private checkPythonModules(): PyShellReturn {
    return this.checkPython(
      "check_modules.py", this.installPythonModules.bind(this));
  }

  private checkPython(script: string, solver: (_: string) => PyShellReturn) {
    const pyshell = this.makePythonShell(script);
    return PythonRunner.commWithPython(pyshell)
      .then(undefined, (messageOrError: string | Error) => {
        if (typeof messageOrError === "string") {
          return solver(messageOrError);
        }
        else {
          throw messageOrError;
        }
      });
  }

  private selectCompatiblePython(message: string): PyShellReturn {
    return vscode.window.showErrorMessage(message, "Select Python Interpreter")
      .then((item: string | undefined) => {
        if (item === "Select Python Interpreter") {
          return vscode.commands.executeCommand("python.setInterpreter");
        } else {
          throw new Error("Failed to change incompatible Python");
        }
      })
      .then(() => {
        this.pythonPath = PythonRunner.getPythonPath();
        return this.checkPythonVersion();
      });
  }

  // `message` is comma-separated missing dependency names
  private installPythonModules(message: string): PyShellReturn {
    return vscode.window.showErrorMessage(
      `Missing Python modules: ${message}`, "Install Missing Dependencies")
      .then((item: string | undefined) => {
        if (item === "Install Missing Dependencies") {
          const pyshell = this.makePythonShell("install_via_pip.py", {
            pythonPath: this.pythonPath,
            args: message.split(", "),
          });
          return PythonRunner.commWithPython(pyshell);
        } else {
          throw new Error("Failed to install missing Python modules");
        }
      })
      .then(() => {
        // re-try to check Pandoc with pypandoc
        return this.checkPythonModules();
      });
  }
}
