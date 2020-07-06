import { InputHints } from 'botbuilder';
import { ComponentDialog, DialogContext, DialogTurnResult, DialogTurnStatus } from 'botbuilder-dialogs';


export class HelpDialog extends ComponentDialog {
    constructor(id: string) {
        super(id);
    }
}