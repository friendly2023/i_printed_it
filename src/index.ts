import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });

bot.setMyCommands([
    {
        command: '/start',
        description: 'Начальное приветствие'
    },
    {
        command: '/menu',
        description: 'Меню'
    }
])

outputMessage()
function outputMessage() {
    bot.on('message', async (msg: { text: string; chat: { id: number; }; from: { first_name: string; }; }) => {
        const text: string = msg.text;
        const chatId: number = msg.chat.id;

        if (text === '/start') {
            return await bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
        }
        if (text === '/menu') {
            return await bot.sendMessage(chatId, `Здесь будет меню`);
        }
    }
    )
}