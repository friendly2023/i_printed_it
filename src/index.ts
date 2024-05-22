import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });
import {
    MenuButtons,
    // creatingMenuButtons,
    // creatingMenuListProductNameIdButtons,
    // creatingMenuListCategoryNameLeftButtons,
    // creatingMenuListByCategoryButtons,
    // creatingMenuListCategoryNameButtons,
    // creatingMenuListProductNameIdSubcategoryButtons,
    // selectionRandomProduct
} from './buttons/menu';

// import { creatingFigurineCard } from './productCard/figurineСard';

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

    async Menu() {
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
        this.Menu()

        this.bot.on('message', async (msg: TelegramApi.Message) => {
            const text: string | undefined = msg.text;
            const chatId: number = msg.chat.id;

            if (text === '/start') {
                return await this.bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
            }
            if (text === '/menu') {
                let buttons = new MenuButtons();
                return await this.bot.sendMessage(chatId, `Выберете вариант отображения:`, await buttons.creatingMenuButtons());
            }
        });

        // this.bot.on('callback_query', async (msg: { message: { chat: { id: number; }; }; data: string; }) => {
        //     const chatId: number = msg.message.chat.id;
        //     const text: string[] = msg.data.split(/\/{2}/g);;

        //     if (text[0] == 'menuList' && text.length == 1) {
        //         return await this.bot.sendMessage(chatId, `Общий список:`,
        //             await this.creatingMenuListProductNameIdButtons());
        //     }
        //     if (text[0] == 'menuCategories' && text.length == 1) {
        //         return await this.bot.sendMessage(chatId, `Выберете категорию:`,
        //             await this.creatingMenuListCategoryNameLeftButtons());
        //     }
        //     if (text[0] == 'luckyMe' && text.length == 1) {
        //         let randomProduct: string = await this.selectionRandomProduct();
        //         let figurineСard = await this.creatingFigurineCard(randomProduct);
        //         return await this.bot.sendMediaGroup(chatId, figurineСard);
        //     }
        //     if (text[0] == 'subcategories' && text.length == 2) {
        //         let categoryNameLeft: string = text[1];
        //         return await this.bot.sendMessage(chatId, `Выбрана категория *${categoryNameLeft}*, выберете подкатегорию`,
        //             await this.creatingMenuListCategoryNameButtons(categoryNameLeft));
        //     }
        //     if (text[0] == 'menuCategories' && text.length == 2) {
        //         let categoryNameLeft: string = text[1];
        //         return await this.bot.sendMessage(chatId, `Выберете из вариантов:`,
        //             await this.creatingMenuListByCategoryButtons(categoryNameLeft));
        //     }
        //     if (text[0] == 'menuCategoriesTwo' && text.length == 2) {
        //         let categoryName: string = text[1];
        //         return await this.bot.sendMessage(chatId, `Открыта подкатегория *${categoryName}*`,
        //             await this.creatingMenuListProductNameIdSubcategoryButtons(categoryName));
        //     }
        //     if (text[0].match(/\d{4}/g)) {
        //         let id: string = text[0];
        //         let figurineСard = await this.creatingFigurineCard(id);
        //         return await this.bot.sendMediaGroup(chatId, figurineСard);
        //     }
        // });
    }


}

let start = new Message(bot);





// outputMessage()
// function outputMessage() {
//     bot.on('message', async (msg: { text: string; chat: { id: number; }; from: { first_name: string; }; }) => {
//         const text: string = msg.text;
//         const chatId: number = msg.chat.id;

//         if (text === '/start') {
//             return await bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
//         }
//         if (text === '/menu') {
//             return await bot.sendMessage(chatId, `Выберете вариант отображения:`, await creatingMenuButtons());
//         }
//     })

//     bot.on('callback_query', async (msg: { message: { chat: { id: number; }; }; data: string; }) => {
//         const chatId: number = msg.message.chat.id;
//         const text: string[] = msg.data.split(/\/{2}/g);;

//         if (text[0] == 'menuList' && text.length == 1) {
//             return await bot.sendMessage(chatId, `Общий список:`,
//                 await creatingMenuListProductNameIdButtons());
//         }
//         if (text[0] == 'menuCategories' && text.length == 1) {
//             return await bot.sendMessage(chatId, `Выберете категорию:`,
//                 await creatingMenuListCategoryNameLeftButtons());
//         }
//         if (text[0] == 'luckyMe' && text.length == 1) {
//             let randomProduct: string = await selectionRandomProduct();
//             let figurineСard = await creatingFigurineCard(randomProduct);
//             return await bot.sendMediaGroup(chatId, figurineСard);
//         }
//         if (text[0] == 'subcategories' && text.length == 2) {
//             let categoryNameLeft: string = text[1];
//             return await bot.sendMessage(chatId, `Выбрана категория *${categoryNameLeft}*, выберете подкатегорию`,
//                 await creatingMenuListCategoryNameButtons(categoryNameLeft));
//         }
//         if (text[0] == 'menuCategories' && text.length == 2) {
//             let categoryNameLeft: string = text[1];
//             return await bot.sendMessage(chatId, `Выберете из вариантов:`,
//                 await creatingMenuListByCategoryButtons(categoryNameLeft));
//         }
//         if (text[0] == 'menuCategoriesTwo' && text.length == 2) {
//             let categoryName: string = text[1];
//             return await bot.sendMessage(chatId, `Открыта подкатегория *${categoryName}*`,
//                 await creatingMenuListProductNameIdSubcategoryButtons(categoryName));
//         }
//         if (text[0].match(/\d{4}/g)) {
//             let id: string = text[0];
//             let figurineСard = await creatingFigurineCard(id);
//             return await bot.sendMediaGroup(chatId, figurineСard);
//         }
//     })
// }
