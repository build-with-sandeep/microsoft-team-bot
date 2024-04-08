const { ActivityHandler, MessageFactory } = require('botbuilder');
const fs = require('fs');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;
            const replyText = await this.getAnswer(userMessage);
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async getAnswer(question) {
        // Load the JSON file containing questions and answers
        const data = JSON.parse(fs.readFileSync('data.json'));

        // Search for the answer corresponding to the question
        for (const entry of data) {
            if (entry.question.toLowerCase() === question.toLowerCase()) {
                return entry.answer;
            }
        }

        // If no answer is found, return a default message
        return "Sorry, I don't understand that question.";
    }
}

module.exports.EchoBot = EchoBot;
