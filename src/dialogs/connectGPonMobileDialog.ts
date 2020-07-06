import {ComponentDialog,ChoicePrompt,ChoiceFactory,ConfirmPrompt,DialogTurnResult,TextPrompt,WaterfallDialog} from 'botbuilder-dialogs';
import { InputHints, MessageFactory, CardFactory } from 'botbuilder';
import { LiveAgentDialog } from './liveAgentDialog';
import { FeedbackDialog } from './feedbackDialog';

const CHOICE_PROMPT = 'choicePrompt';
const CONFIRM_PROMPT = 'confirmPrompt';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
const LIVE_AGENT_DIALOG = 'liveAgentDialog';
const FEEDBACK_DIALOG = 'feedbackDialog';

const CreateincidentCard = require('../../resources/createincidentCard.json');

export class ConnectGPonMobileDialog extends ComponentDialog {
    constructor(id : string) {
       super(id || 'ConnectGPonMobileDialog');
      
       this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new LiveAgentDialog(LIVE_AGENT_DIALOG))
            .addDialog(new FeedbackDialog(FEEDBACK_DIALOG))
            .addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.firstStep.bind(this),
                this.secondStep.bind(this),
                this.thirdStep.bind(this),
                this.fourthStep.bind(this),
                this.fifthStep.bind(this),
                this.sixthStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

     async firstStep(stepContext) {
        
        const messageText = 'You have to be enrolled to Intune company portal. If you are not enrolled, please use the link:https://amway.service-now.com/sp?id=sc_cat_item&sys_id=4e7e9ff8dbd65b80a78ad2c75e96198d.Global protect should not be installed directly from the default play store or app store. You have to install Global protect from the Intune managed play store or app store.';
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt(TEXT_PROMPT, { prompt: msg });

    }

        async secondStep(stepContext) {
        const gpDetails = stepContext.options ;   
        gpDetails.first= stepContext.result;
        const messageText = 'Please confirm if the issue is resolved?'
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
      return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
    }

    /*async cardStep(stepContext)
    {
        const gpDetails = stepContext.options as GPDetails;
        gpDetails.choice=stepcontext.result.value;
        const form=MessageFactory.attachment(CardFactory.adaptiveCard(CardFactory.feedbackCard(stepContext)));
        await stepContext.context.sendActivity (form);
        let feedbackdetails=new Feedbackdetails();
        return await stepContext.beginDialog('feedbackDialog', feedbackDetails);

    }*/
  
     async thirdStep(stepContext){

        const gpDetails = stepContext.options; 
        gpDetails.second= stepContext.result;
        if(stepContext.result === true)
         {
            console.log("HELLO1");
            const MessageText='Is there anything else I can help you with?';
            const msg = MessageFactory.text(MessageText, MessageText, InputHints.ExpectingInput);
            return await stepContext.prompt(CONFIRM_PROMPT, { prompt: msg });
            }
        else
         {
                return await stepContext.beginDialog(LIVE_AGENT_DIALOG, { gpDetails } );
                
         }
    }

       async fourthStep(stepContext) {
        const gpDetails = stepContext.options; 
        gpDetails.third= stepContext.result;
       
        if(stepContext.result === true){
            console.log("HELLO2");
            return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Select one of the options below:',
            choices: ChoiceFactory.toChoices(['Create an incident', 'Need to install Global protect for non amway laptops'])
        });
    }
    else if(stepContext.result === false){
        return await stepContext.beginDialog(FEEDBACK_DIALOG, { gpDetails } );
        }
        else{
        return await stepContext.endDialog();
        }
   }
      
    async fifthStep(stepContext){
        const gpDetails=stepContext.options; 
        gpDetails.third= stepContext.result;
        if(stepContext.result.index == "0" ){
            console.log("PARTY");
        const messageText = 'The following incident has been created and assigned to Service Desk team';
        const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        const cardPrompt = MessageFactory.text('');
        const createincidentCard = CardFactory.adaptiveCard(CreateincidentCard);
        cardPrompt.attachments = [createincidentCard];
        return await stepContext.prompt(TEXT_PROMPT, cardPrompt);
            }
             else{
                return await stepContext.endDialog();
                }
       
       }

       async sixthStep(stepContext){
        const gpDetails = stepContext.options; 
        gpDetails.third= stepContext.result;
               return await stepContext.beginDialog(FEEDBACK_DIALOG, { gpDetails } );
                return await stepContext.endDialog();
    }
       
}

