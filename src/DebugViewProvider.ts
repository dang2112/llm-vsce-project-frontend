import * as vscode from "vscode"; //webview, which is basically html

export class DebugViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = "pythonDebugAgent.debugView";

    constructor(
        private readonly extensionUri: vscode.Uri
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView
    ): void {

        webviewView.webview.options = {
            enableScripts: true
        };

        webviewView.webview.html = this.getHtml();

        webviewView.webview.onDidReceiveMessage(
            async (message) => {

                if (message.type === "debug") {

                    await this.handleDebugRequest(
                        webviewView,
                        message
                    );
                }
            }
        );
    }


    private async handleDebugRequest(
        webviewView: vscode.WebviewView,
        message: {
            sourceCode: string;
            errorLog: string;
        }
    ) {

        // we'll implement this next
    }


    private getHtml(): string {

        return `
        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            >

            <title>Python Debug Agent</title>

        </head>

        <body>

            <h2>Python Debug Agent</h2>

            <label>Source Code</label>

            <textarea
                id="sourceCode"
                rows="12"
                style="width: 100%;"
            ></textarea>

            <br><br>

            <label>Error Log / Traceback</label>

            <textarea
                id="errorLog"
                rows="8"
                style="width: 100%;"
            ></textarea>

            <br><br>

            <button id="debugButton">
                Debug
            </button>

            <hr>

            <h3>Diagnosis</h3>

            <pre
                id="result"
                style="white-space: pre-wrap;"
            ></pre>


            <script>

                const vscode = acquireVsCodeApi();

                const debugButton =
                    document.getElementById("debugButton");

                const sourceCode =
                    document.getElementById("sourceCode");

                const errorLog =
                    document.getElementById("errorLog");

                const result =
                    document.getElementById("result");


                debugButton.addEventListener(
                    "click",
                    () => {

                        result.textContent = "Analyzing...";

                        vscode.postMessage({

                            type: "debug",

                            sourceCode: sourceCode.value,

                            errorLog: errorLog.value
                        });
                    }
                );


                window.addEventListener(
                    "message",
                    event => {

                        const message = event.data;

                        if (
                            message.type
                            === "debugResult"
                        ) {

                            result.textContent =
                                message.explanation;
                        }


                        if (
                            message.type
                            === "debugError"
                        ) {

                            result.textContent =
                                "Error: "
                                + message.error;
                        }
                    }
                );

            </script>

        </body>

        </html>
        `;
    }
}