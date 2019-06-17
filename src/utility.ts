import * as vscode from "vscode";
import { constants } from "./constants";

export function consoleInfo(message: string): void {
  console.info(`[${constants.name}] ${message}`);
}

export function showError(messageOrError: string | Error): void {
  if (typeof messageOrError === "string") {
    vscode.window.showErrorMessage(messageOrError);
  } else {
    vscode.window.showErrorMessage(messageOrError.message);
  }
}
