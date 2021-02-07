//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
//import * as myExtension from '../extension';

const EXTENSION_ID = "irisTa56.markdown2textile";
const EXTENSION_COMMANDS = [
  "markdown2textile.convertText",
];

const activateExtension = (): Thenable<void> => {
  return new Promise((resolve, reject) => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    if (typeof extension === "undefined") { reject(); }
    else {
      if (extension.isActive === false) {
        extension.activate().then(() => { resolve(); });
      } else {
        resolve();
      }
    }
  });
};

suite("Markdown2Textile: Extension Tests", () => {

  test("should be present", () => {
    assert.ok(vscode.extensions.getExtension(EXTENSION_ID));
  });

  test("should be able to register markdown2textile commands", () => {
    activateExtension().then(() => {
      vscode.commands.getCommands(true).then((commands) => {
        const foundCommands = commands.filter((value) =>
          EXTENSION_COMMANDS.indexOf(value) >= 0 || value.startsWith("markdown2textile.")
        );
        assert.equal(foundCommands.length, EXTENSION_COMMANDS.length);
      });
    });
  });
});
