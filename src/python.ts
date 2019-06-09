import { PythonShell, PythonShellError } from 'python-shell';
import replaceInFile, { ReplaceInFileConfig } from 'replace-in-file';
import * as path from 'path';
import * as vscode from 'vscode';

export class PythonRunner {
  private pythonPath: string;
  private scriptsDir: string;
  private static instance: PythonRunner;

  private constructor(context: vscode.ExtensionContext) {
    this.pythonPath = this.getPyConfiguration('pythonPath');
    this.scriptsDir = context.asAbsolutePath('scripts');
    this.runPython('check_version.py');
    this.runPython('check_modules.py');
    // replace shebang of scripts/pandoc_filter.py to the current Python
    const options: ReplaceInFileConfig = {
      files: path.join(this.scriptsDir, 'pandoc_filter.py'),
      from: new RegExp('^#!/.*', 'i'),
      to: `#!${this.pythonPath}`,
    };
    replaceInFile(options)
      .then((_) => { console.log('Python executable:', this.pythonPath); })
      .catch(error => { console.error(error); });
  }

  public static getInstance(context: vscode.ExtensionContext): PythonRunner {
    if (!PythonRunner.instance) {
      PythonRunner.instance = new PythonRunner(context);
    }
    return PythonRunner.instance;
  }

  public convertText(text: string): void {
    const pyshell = new PythonShell(
      path.join(this.scriptsDir, 'markdown_to_textile.py'),
      { pythonPath: this.pythonPath });
    pyshell.send(text);
    this.endPython(pyshell);
  }

  private runPython(filename: string) {
    const pyshell = new PythonShell(
      path.join(this.scriptsDir, filename), { pythonPath: this.pythonPath });
    this.endPython(pyshell);
  }

  private endPython(pyshell: PythonShell) {
    pyshell.on('message', (message: string) => {
      if (message !== 'OK') { vscode.window.showErrorMessage(message); }
    }).end((error: PythonShellError) => {
      if (error) { console.error(error); }
    });
  }

  private getPyConfiguration(name: string): string {
    const pyConfiguration = vscode.workspace.getConfiguration('python', null);
    // fallback to Homebrewed Python
    return pyConfiguration.get<string>(name, '/usr/local/bin/python3');
  }
}
