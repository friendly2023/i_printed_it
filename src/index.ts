import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });
import {
    creatingMenuButtons,
    creatingMenuListProductNameIdButtons,
    creatingMenuListCategoryNameLeftButtons,
    creatingMenuListCategoryNameButtons
} from './buttons/menu';

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
            return await bot.sendMessage(chatId, `Выберете вариант отображения:`, await creatingMenuButtons());
        }
    })

    bot.on('callback_query', async (msg: { message: { chat: { id: number; }; }; data: string; }) => {
        const chatId: number = msg.message.chat.id;
        const text: string[] = msg.data.split(/\/{2}/g);;

        if (text[0] == 'menuList' && text.length == 1) {
            return await bot.sendMessage(chatId, `Общий список:`,
                await creatingMenuListProductNameIdButtons());
        }
        if (text[0] == 'menuCategories' && text.length == 1) {
            return await bot.sendMessage(chatId, `Выберете категорию:`,
                await creatingMenuListCategoryNameLeftButtons());
        }
        if (text[0] == 'menuCategories' && text.length == 2) {
            let categoryNameLeft: string = text[1];
            return await bot.sendMessage(chatId, `Выберете подкатегорю:`,
                await creatingMenuListCategoryNameButtons(categoryNameLeft));
        }
    })
}
