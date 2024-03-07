import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });

outputMessage()
function outputMessage() {
    bot.on('message', async (msg: { text: string; chat: { id: number; }; from: { first_name: string; }; }) => {
        const text: string = msg.text;
        const chatId: number = msg.chat.id;
    })}