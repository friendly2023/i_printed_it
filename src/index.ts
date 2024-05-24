import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });
import { MenuButtons } from './buttons/menu';
import { FigurineCard } from './productCard/figurineСard';

class MenuItems {
    command!: string;
    description!: string;
}

class Message {
    private bot: any;

    constructor(bot: any) {
        this.bot = bot;
        this.outputMessage();
    }

    private async Menu() {
        let menu: MenuItems = bot.setMyCommands([
            {
                command: '/start',
                description: 'Начальное приветствие'
            },
            {
                command: '/menu',
                description: 'Меню'
            }
        ])
        return menu
    }

    async outputMessage() {
        this.Menu();

        this.bot.on('message', async (msg: TelegramApi.Message) => {
            const text: string | undefined = msg.text;
            const chatId: number = msg.chat.id;

            switch (text) {
                case '/start':
                    this.handleStart(chatId);
                    break;

                case '/menu':
                    this.handleMenu(chatId);
                    break;
            }
        });

        this.bot.on('callback_query', async (msg: { message: { chat: { id: number; }; }; data: string; }) => {
            const chatId: number = msg.message.chat.id;
            const text: string[] = msg.data.split(/\/{2}/g);

            switch (text[0]) {
                case 'menuList':
                    this.handleMenuList(chatId);
                    break;

                case 'menuCategories':
                    this.handleMenuCategories(chatId);
                    break;

                case 'luckyMe':
                    this.handleLuckyMe(chatId);
                    break;

                case 'menuCategoriesOpen':
                    this.handleMenuCategoriesOpen(chatId, text);
                    break;

                case 'subcategories':
                    this.handleSubcategories(chatId, text);
                    break;

                case 'menuCategoriesTwo':
                    this.handleMenuCategoriesTwo(chatId, text);
                    break;
            }

            if (text[0].match(/\d{4}/g)) {
                this.handleIdentifier4(chatId, text);
            }

        });
    };

    private async handleStart(chatId: number) {
        return await this.bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
    };

    private async handleMenu(chatId: number) {
        let buttons = new MenuButtons();
        return await this.bot.sendMessage(chatId, `Выберете вариант отображения:`, await buttons.creatingMenuButtons());
    };

    private async handleMenuList(chatId: number) {
        let buttons = new MenuButtons();
        return await bot.sendMessage(chatId, `Общий список:`, await buttons.creatingMenuListProductNameIdButtons());
    };

    private async handleMenuCategories(chatId: number) {
        let buttons = new MenuButtons();
        return await bot.sendMessage(chatId, `Выберете категорию:`, await buttons.creatingMenuListCategoryNameLeftButtons());
    };

    private async handleLuckyMe(chatId: number) {
        let buttons = new MenuButtons();
        let randomProduct: string = await buttons.selectionRandomProduct();
        let figurineСard = new FigurineCard(randomProduct);
        return await bot.sendMediaGroup(chatId, await figurineСard.writingMessageToPhoto());
    };

    private async handleMenuCategoriesOpen(chatId: number, text: string[]) {
        let buttons = new MenuButtons();
        return await bot.sendMessage(chatId, `Выберете из вариантов:`,
            await buttons.creatingMenuListByCategoryButtons(text[1]));
    };

    private async handleSubcategories(chatId: number, text: string[]) {
        let buttons = new MenuButtons();
        return await bot.sendMessage(chatId, `Выбрана категория *${text[1]}*, выберете подкатегорию`,
            await buttons.creatingMenuListCategoryNameButtons(text[1]));
    };

    private async handleMenuCategoriesTwo(chatId: number, text: string[]) {
        let buttons = new MenuButtons();
        return await bot.sendMessage(chatId, `Открыта подкатегория *${text[1]}*`,
            await buttons.creatingMenuListProductNameIdSubcategoryButtons(text[1]));
    };

    private async handleIdentifier4(chatId: number, text: string[]) {
        let figurineСard = new FigurineCard(text[0]);
        return await bot.sendMediaGroup(chatId, await figurineСard.writingMessageToPhoto());
    };
}

let start = new Message(bot);
