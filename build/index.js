"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegramKey_1 = require("./serviceKey/telegramKey");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const bot = new node_telegram_bot_api_1.default(telegramKey_1.token, { polling: true });
const menu_1 = require("./buttons/menu");
bot.setMyCommands([
    {
        command: '/start',
        description: 'Начальное приветствие'
    },
    {
        command: '/menu',
        description: 'Меню'
    }
]);
outputMessage();
function outputMessage() {
    bot.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            return yield bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
        }
        if (text === '/menu') {
            return yield bot.sendMessage(chatId, `Выберете вариант отображения:`, yield (0, menu_1.creatingMenuButtons)());
        }
    }));
    bot.on('callback_query', (msg) => __awaiter(this, void 0, void 0, function* () {
        const chatId = msg.message.chat.id;
        const text = msg.data;
        if (text.slice(0, 8) == 'menuList') {
            return yield bot.sendMessage(chatId, `список всех товаров`);
        }
    }));
}
