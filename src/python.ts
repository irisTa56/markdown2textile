import * as vscode from "vscode";
import { PythonShell } from "python-shell";
import { consoleInfo, showError } from "./utility";

const fs = require("fs");
const path = require("path");
const replace = require('replace-in-file');

type PyShellReturn = Thenable<string | Error | void>;

export class PythonRunner {
  private scriptsDir: string;
  private pythonPath: string;
  private static instance: PythonRunner;

  private constructor(context: vscode.ExtensionContext) {
    this.scriptsDir = context.asAbsolutePath("scripts");
    this.pythonPath = PythonRunner.getPythonPath();
    this.afterSettingPython();
  }

  public static getInstance(context: vscode.ExtensionContext): PythonRunner {
    if (!PythonRunner.instance) {
      PythonRunner.instance = new PythonRunner(context);
    }
    return PythonRunner.instance;
  }

  private static getPythonPath(): string {
    const config = vscode.workspace.getConfiguration("markdown2textile");
    // fallback to System Python
    return config.get<string>("pythonPathToUsePandoc", "/usr/bin/python3");
  }

  private static commWithPython(pyshell: PythonShell, textToPython?: string): PyShellReturn {
    return new Promise((resolve, reject) => {
      if (typeof textToPython === "string") { pyshell.send(textToPython); }
      pyshell.on("message", (message: string) => { reject(message); });
      pyshell.end((error: Error) => {
        if (error) { reject(error); }
        else { resolve(); }
      });
    });
  }

  public convertText(text: string): void {
    const pyshell = this.makePythonShell("markdown_to_textile.py");
    PythonRunner.commWithPython(pyshell, text).then(undefined, showError);
  }

  public updatePythonPath(): void {
    this.pythonPath = PythonRunner.getPythonPath();
    this.afterSettingPython();
  }

  private afterSettingPython() {
    this.checkPython()
      .then(() => { consoleInfo(`Python is ${this.pythonPath}`); })
      .then(() => this.checkPythonModules())
      .then(() => { consoleInfo(`Required Python modules are OK!`); })
      .then(() => {
        // replace shebang of scripts/pandoc_filter.py to the current Python
        replace({
          files: path.join(this.scriptsDir, "pandoc_filter.py"),
          from: new RegExp("^#!/.*"),
          to: `#!${this.pythonPath}`,
        }).catch(showError);
      })
      .then(undefined, showError);
  }

  private makePythonShell(script: string, option: object = {}): PythonShell {
    return new PythonShell(
      path.join(this.scriptsDir, script),
      Object.assign(option, { pythonPath: this.pythonPath }));
  }

  private checkPython(): PyShellReturn {
    return fs.promises.access(this.pythonPath)
      .then(() => {
        return this.checkUsingPython(
          "check_version.py", this.openSettingsJson.bind(this));
      })
      .then(undefined, () => {
        return this.openSettingsJson("Python does not exist");
      });
  }

  private checkPythonModules(): PyShellReturn {
    return this.checkUsingPython(
      "check_modules.py", this.installPythonModules.bind(this));
  }

  private checkUsingPython(script: string, solver: (_: string) => PyShellReturn) {
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

  private openSettingsJson(message: string): PyShellReturn {
    return vscode.window.showWarningMessage(
      "You need to set Python to use Pandoc", "Open settings.json")
      .then((item: string | undefined) => {
        if (item === "Open settings.json") {
          vscode.commands.executeCommand("workbench.action.openSettingsJson");
          // throw an empty error to skip following checks
          throw new Error();
        }
        throw new Error(message);
      });
  }

  // `message` is comma-separated missing dependency names
  private installPythonModules(message: string): PyShellReturn {
    return vscode.window.showWarningMessage(
      `Missing Python modules: ${message}`, "Install Missing Dependencies")
      .then((item: string | undefined) => {
        if (item === "Install Missing Dependencies") {
          return this.installPythonModulesImpl(message.split(", "));
        } else {
          throw new Error("You did not install missing Python modules");
        }
      })
      .then(() => {
        // re-try to check Pandoc with pypandoc
        return this.checkPythonModules();
      });
  }

  private installPythonModulesImpl(args: string[]): PyShellReturn {
    const pyshell = this.makePythonShell("install_via_pip.py", { args: args });
    return PythonRunner.commWithPython(pyshell);
  }
}
