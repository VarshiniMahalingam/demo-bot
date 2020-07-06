import { InputHints, MessageFactory, CardFactory } from 'botbuilder';
import {ComponentDialog,ChoicePrompt,ChoiceFactory,ConfirmPrompt,DialogTurnResult,TextPrompt,WaterfallDialog,WaterfallStepContext} from 'botbuilder-dialogs';

export class GPDetails {
    public first: string;
    public second: string;
    public third: string;
    public fourth: string;
    public fifth: string;

}