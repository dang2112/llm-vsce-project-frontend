// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; //VSC API, read editor state and call localhost
//later use this to read workspace files and invoke tools

import { DebugViewProvider } from "./DebugViewProvider";


export function activate(
    context: vscode.ExtensionContext
) {

    const provider =
        new DebugViewProvider(
            context.extensionUri
        );


    context.subscriptions.push(

        vscode.window.registerWebviewViewProvider(

            DebugViewProvider.viewType, //matches ID contributed in package.json

            provider
        )
    );
}


export function deactivate() {}