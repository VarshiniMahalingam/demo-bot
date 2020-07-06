
import { InputHints, MessageFactory, StatePropertyAccessor, TurnContext } from 'botbuilder';
import { LuisRecognizer } from 'botbuilder-ai';
import { ComponentDialog,DialogSet,DialogState,DialogTurnResult,DialogTurnStatus,TextPrompt,WaterfallDialog,WaterfallStepContext} from 'botbuilder-dialogs';
import { InstallGPDialog } from './installGlobalProtectDialog';
import { LuiRecognizer } from './luisRecognizer';
import { ConnectGPonMobileDialog } from './connectGPonMobileDialog';
import { GPDetails } from './GPDetails';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
//const TEXT_PROMPT = 'textPrompt';
const INSTALL_GP_DIALOG = 'installGlobalProtectDialog';
const CONNECT_GP_ON_MOBILE_DIALOG = 'connectGPonMobileDialog';

export class MainDialog extends ComponentDialog {
private luisRecognizer: LuiRecognizer;
constructor(luisRecognizer: LuiRecognizer, installGlobalProtectDialog: InstallGPDialog , connectGPonMobileDialog: ConnectGPonMobileDialog) {
super('MainDialog');

        if (!luisRecognizer) throw new Error('[MainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;
        if (!installGlobalProtectDialog) throw new Error('[MainDialog]: Missing parameter \'installGlobalProtectDialog\' is required');
        if (!connectGPonMobileDialog) throw new Error('[MainDialog]: Missing parameter \'connectGPonMobileDialog\' is required');

        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new InstallGPDialog(INSTALL_GP_DIALOG))
            .addDialog(new ConnectGPonMobileDialog(CONNECT_GP_ON_MOBILE_DIALOG))
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.introStep.bind(this),
                this.actStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }
    
public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
}

private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (!this.luisRecognizer.isConfigured) {
            const luisConfigMsg = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(luisConfigMsg, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }
        const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : 'What can I help you with today?\nSay something like "Want to install global protect or Connect Global protect on Mobile and tablets"';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
}

    
private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
      
    const gpDetails = {};

        if (!this.luisRecognizer.isConfigured) {
            return await stepContext.beginDialog('installGlobalProtectDialog',gpDetails);
        }

        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        console.log(luisResult);
        
        switch (LuisRecognizer.topIntent(luisResult)) {
           
        case 'Connect_Global_Protect':
            console.log("HIHIHIHI");
            return await stepContext.beginDialog('connectGPonMobileDialog', gpDetails );
            console.log("HIHIHI");
            console.log("HIHIHIHI");
           
        case 'install_Global_protect':
            return await stepContext.beginDialog('installGlobalProtectDialog', gpDetails );
            
        default:
            const didntUnderstandMessageText = `Sorry, I didn't get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
            await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
        }

        return await stepContext.next();
}

   
private async finalStep(stepContext) {
        if (!stepContext.result) {
            return await stepContext.context.sendActivity('Thank you for contacting CSD Bot. Have a great day.')
        }
        else {
            return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
        }
}
}
