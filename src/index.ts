import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
export const bot: any = new TelegramApi(token, { polling: true });
import { MenuButtons, MenuRepository } from './buttons/buttonsMenu';
import { FigurineCard, FigurineCardRepository } from './productCard/figurineСard';
import { DatabaseConnection, DatabaseRepository } from './DB/query';
import { ProductRepository, RequestsToDB } from './DB/requestsToDB';
import { ButtonsProductCard, IButtonsProductCard } from './buttons/buttonsProductCard';

class MenuItems {
    command!: string;
    description!: string;
}

interface MyBotInterface {
    outputMessage(): any;
}

export class MyBot implements MyBotInterface {
    bot: any;
    private menuRepository: MenuRepository;
    private figurineCardRepository: FigurineCardRepository;
    private productRepository: ProductRepository;
    private iButtonsProductCard: IButtonsProductCard;

    constructor(menuRepository: MenuRepository, figurineCardRepository: FigurineCardRepository, productRepository: ProductRepository, iButtonsProductCard: IButtonsProductCard) {
        this.bot = bot;
        this.menuRepository = menuRepository;
        this.figurineCardRepository = figurineCardRepository;
        this.productRepository = productRepository;
        this.iButtonsProductCard = iButtonsProductCard;
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
            },
            {
                command: '/shoppingcart',
                description: 'Корзина'
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

                case '/shoppingcart':
                    this.handleShoppingCart(chatId);
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

                case 'more':
                    this.handleMore(chatId, text);
                    break;

                case 'feedback':
                    this.handleFeedback(chatId, text);
                    break;

                case 'newrating':
                    this.handleNewRating(chatId, text);
                    break;

                case 'inShoppingCart':
                    this.handleInShoppingCart(chatId, text);
                    break;
            }

            if (text[0].match(/\d{4}/g)) {
                this.handleIdentifier4(chatId, text);
            }

        });
    };

    private async handleStart(chatId: number): Promise<string> {
        return await this.bot.sendMessage(chatId, `Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu`);
    };

    private async handleMenu(chatId: number) {
        return await this.bot.sendMessage(chatId, `Выберете вариант отображения:`, await this.menuRepository.creatingMenuButtons());
    };

    private async handleShoppingCart(chatId: number) {
        return await this.bot.sendMessage(chatId, `Здесь будет корзина`);
    }

    private async handleMenuList(chatId: number) {
        return await bot.sendMessage(chatId, `Общий список:`, await this.menuRepository.creatingMenuListProductNameIdButtons());
    };

    private async handleMenuCategories(chatId: number) {
        return await bot.sendMessage(chatId, `Выберете категорию:`, await this.menuRepository.creatingMenuListCategoryNameLeftButtons());
    };

    private async handleLuckyMe(chatId: number) {
        let randomProduct: string = await this.menuRepository.selectionRandomProduct();
        let figurineСard = new FigurineCard(this.productRepository);
        return await bot.sendMediaGroup(chatId, await figurineСard.writingMessageToPhoto(randomProduct));
    };

    private async handleMenuCategoriesOpen(chatId: number, text: string[]) {
        return await bot.sendMessage(chatId, `Выберете из вариантов:`,
            await this.menuRepository.creatingMenuListByCategoryButtons(text[1]));
    };

    private async handleSubcategories(chatId: number, text: string[]) {
        return await bot.sendMessage(chatId, `Выбрана категория *${text[1]}*, выберете подкатегорию`,
            await this.menuRepository.creatingMenuListCategoryNameButtons(text[1]));
    };

    private async handleMenuCategoriesTwo(chatId: number, text: string[]) {
        return await bot.sendMessage(chatId, `Открыта подкатегория *${text[1]}*`,
            await this.menuRepository.creatingMenuListProductNameIdSubcategoryButtons(text[1]));
    };

    private async handleIdentifier4(chatId: number, text: string[]) {
        const firstMessage = await this.sendingFigurineCardImage(chatId, text);
        const secondMessage = await this.sendingFigurineCardButtons(chatId, text);
    };

    private async sendingFigurineCardImage(chatId: number, text: string[]) {
        return await bot.sendMediaGroup(chatId, await this.figurineCardRepository.writingMessageToPhoto(text[0]));
    }

    private async sendingFigurineCardButtons(chatId: number, text: string[]) {
        let resultSecondMessage = await this.iButtonsProductCard.creatingBasicButtons(text[0]);

        return await bot.sendMessage(chatId, `Категория: ${resultSecondMessage[0]} > ${resultSecondMessage[1]}`,
            resultSecondMessage[2]);
    }

    private async handleMore (chatId: number, text: string[]) {
        // let description = await this.productRepository.respondsDescription(text[1]);
        let message = await this.figurineCardRepository.writingMessageWithDescription(text[1]);

        return await bot.sendMessage(chatId, message, await this.iButtonsProductCard.creatingButtonsBack(text[1]));
    }

    private async handleFeedback (chatId: number, text: string[]) {
        let nameProduct = await this.productRepository.respondsProductName(text[1]);
        let userId: string = String(chatId);
        let oldFeedback = await this.productRepository.respondsOldFeedback(text[1], userId);
        let message: string;

        if (oldFeedback.length == 0) {
            message = `Оцените '${nameProduct[0].product_name}' от ⭐️1 до ⭐️5:`
        } else {
            message = `Оцените '${nameProduct[0].product_name}' от ⭐️1 до ⭐️5.
Ваша старая оценка: ⭐️ ${oldFeedback[0].rating}:`
        }

        return await bot.sendMessage(chatId, message,
            await this.iButtonsProductCard.creatingButtonsRating(text[1]));
    }

    private async handleNewRating(chatId: number, text: string[]) {
        let newRating: number = Number(text[1]);
        let userId: string = String(chatId);
        let recordRating = await this.productRepository.recordNewFeedback(text[2], userId, newRating);
        let nameProduct = await this.productRepository.respondsProductName(text[2]);        
        let message: string = `Вы оценили в ⭐️${newRating} '${nameProduct[0].product_name}'.
Спасибо за отзыв!`;

        return await bot.sendMessage(chatId, message, await this.iButtonsProductCard.creatingButtonsBack(text[2]));
    }

    private async handleInShoppingCart(chatId: number, text: string[]) {
        let userId: string = String(chatId);
        let inShoppingCart = await this.productRepository.recordInShoppingCart(text[1], userId);
        let nameProduct = await this.productRepository.respondsProductName(text[1]);

        let message: string = `'${nameProduct[0].product_name}' добавлен(а) в корзину.
Кол-во в корзине: ***`

        return await bot.sendMessage(chatId, message);
        //прикрутить кнопку перехода в корзину
    }
}

async function createMessageInstance() {
    const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
    const productRepository: ProductRepository = new RequestsToDB(databaseRepository);
    const menuRepository: MenuRepository = new MenuButtons(productRepository);
    const iButtonsProductCard: IButtonsProductCard = new ButtonsProductCard(productRepository);
    const figurineCardRepository: FigurineCardRepository = new FigurineCard(productRepository);

    const message = new MyBot(menuRepository, figurineCardRepository, productRepository, iButtonsProductCard);
    return message;
}

createMessageInstance();
