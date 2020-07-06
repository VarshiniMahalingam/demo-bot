import {ComponentDialog,TextPrompt,ConfirmPrompt,WaterfallDialog} from 'botbuilder-dialogs';
import { InputHints, MessageFactory, CardFactory } from 'botbuilder';
import { FeedbackDialog } from './feedbackDialog';


const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const FEEDBACK_DIALOG = 'feedbackDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
const LiveagentCard = require('../../resources/liveagentCard.json');


export class LiveAgentDialog extends ComponentDialog {
    constructor(id : string){
    super(id || 'liveAgentDialog')

    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
        .addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new FeedbackDialog(FEEDBACK_DIALOG))
        .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
        this.initialStep.bind(this),
        this.finalStep.bind(this)
    ]));

this.initialDialogId = WATERFALL_DIALOG;
}

async initialStep(stepContext){
    console.log("VARSHINI!!!!!!");
    const MessageText='Would you like me to connect you with a Service Desk Agent?';
            const msg = MessageFactory.text(MessageText, MessageText, InputHints.ExpectingInput);
            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
}

async finalStep (stepContext){
    const feedbackDetails = {} ;
    if(stepContext.result === true){
                console.log("VARSHINI SUCCESS");
     const messageText = 'You are connected to live agent.';
     const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
     const cardPrompt = MessageFactory.text('');
     const liveagentCard = CardFactory.adaptiveCard(LiveagentCard);
     cardPrompt.attachments = [liveagentCard];
     return await stepContext.prompt(TEXT_PROMPT, cardPrompt);
              
     }
     else {
            return await stepContext.beginDialog(FEEDBACK_DIALOG, { feedbackDetails } );
             }
    return await stepContext.endDialog();
 }
}
