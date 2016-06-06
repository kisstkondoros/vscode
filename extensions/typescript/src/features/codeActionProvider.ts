/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import {CodeActionProvider, TextDocument, Range, Command, CodeActionContext, CancellationToken} from 'vscode';

import { ITypescriptServiceClient } from '../typescriptService';
import * as Proto from '../protocol';

export default class TypeScriptCodeActionProvider implements CodeActionProvider {
	private client: ITypescriptServiceClient;

	public constructor(client: ITypescriptServiceClient) {
		this.client = client;
	}

	public provideCodeActions(document: TextDocument, range: Range, context: CodeActionContext, token: CancellationToken): Thenable<Command[]> {
		return new Promise<Command[]>((resolve, reject) => {
			let args: Proto.FileLocationRequestArgs = { file: document.fileName, line: range.start.line + 1, offset: range.start.character +1  };
			return (<Promise<Proto.QuickFixResponse>>this.client.execute('quickfix', args, token)).then(res => {
				resolve(res.body.quickFixes.map(quickfix => {
					return {
						title: quickfix.display,
						command: 'typescript.quickfix',
						arguments: [quickfix]
					};
				}));
			}, reject);
		});
	}
}
