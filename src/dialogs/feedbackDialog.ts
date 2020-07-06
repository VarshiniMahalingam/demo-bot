import {ComponentDialog,TextPrompt,ConfirmPrompt,ChoicePrompt,ChoiceFactory,WaterfallDialog} from 'botbuilder-dialogs';
import { InputHints, MessageFactory, CardFactory } from 'botbuilder';


const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const CHOICE_PROMPT = 'choicePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';


export class FeedbackDialog extends ComponentDialog {
    constructor(id : string){
    super(id || 'feedbackDialog')

    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new ChoicePrompt(CHOICE_PROMPT))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        this.initialStep.bind(this),
        this.finalStep.bind(this)
    ]));

this.initialDialogId = WATERFALL_DIALOG;
}

async initialStep(stepContext){
    console.log("VARSHINI!!!!!!");
       return await stepContext.prompt(CHOICE_PROMPT, {
        prompt: 'Please take a minute to share your experience with us to serve you better.How would you rate the service you just received from CSD Bot?',
        choices: ChoiceFactory.toChoices(['GREAT', 'GOOD','AVERAGE','POOR','NOT HELPFUL']),
    });
}

async finalStep (stepContext){
    if(stepContext.result.index == "0" || stepContext.result.index == "1"){
        console.log("VARSHINI SUCCESS");
        const messageText = 'Thanks for the feedback and for using CSD Bot!';
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
    }
    else {
        const messageText = 'Apologies for that kind of experience.Please provide details of what went wrong during todays conversation?';
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });
    }
    return await stepContext.endDialog();
 }
}