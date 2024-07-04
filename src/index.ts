import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
export const bot: any = new TelegramApi(token, { polling: true });
import { MenuButtons, MenuRepository } from './buttons/buttonsMenu';
import { FigurineCard, FigurineCardRepository } from './productCard/figurineСard';
import { DatabaseConnection, DatabaseRepository } from './DB/query';
import { ProductRepository, RequestsToDB } from './DB/requestsToDB';
import { ButtonsProductCard, IButtonsProductCard } from './buttons/buttonsProductCard';
import { IShoppingCart, ShoppingCart } from './shoppingCart/shoppingCart';

let myTelegramId: string = '412993464';

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
    private iShoppingCart: IShoppingCart;

    constructor(menuRepository: MenuRepository,
        figurineCardRepository: FigurineCardRepository,
        productRepository: ProductRepository,
        iButtonsProductCard: IButtonsProductCard,
        iShoppingCart: IShoppingCart) {
        this.bot = bot;
        this.menuRepository = menuRepository;
        this.figurineCardRepository = figurineCardRepository;
        this.productRepository = productRepository;
        this.iButtonsProductCard = iButtonsProductCard;
        this.iShoppingCart = iShoppingCart;
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

        this.bot.on('callback_query', async (msg: { message: { chat: { id: number; first_name: string; username: string }; }; data: string; }) => {
            const chatId: number = msg.message.chat.id;
            const text: string[] = msg.data.split(/\/{2}/g);
            const userName: string = msg.message.chat.username;
            const firstName: string =msg.message.chat.first_name;
            
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

                case 'shoppingCart':
                    this.handleShoppingCart(chatId);
                    break;

                case 'placeAnOrder':
                    this.handlePlaceAnOrder(chatId, firstName, userName);
                    break;

                case 'editShoppingCart':
                    this.handleEditShoppingCart(chatId);
                    break;

                case 'editingShoppingCart':
                    this.handleEditingShoppingCart(chatId, text);
                    break;

                case 'clearShoppingCart':
                    this.handleClearShoppingCart(chatId);
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
        let userId: string = String(chatId);
        let message: string = await this.iShoppingCart.displayShoppingCart(userId);

        if (message == this.iShoppingCart.messageForEmptyShoppingCart()) {
            return await this.bot.sendMessage(chatId, message);
        } else {
            return await this.bot.sendMessage(chatId, await this.iShoppingCart.displayShoppingCart(userId),
                await this.iButtonsProductCard.descriptionButtonsShoppingCart());
        }
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
        let quantityProduct = await this.productRepository.respondsQuantityProduct(text[1], userId);

        let message: string = `'${nameProduct[0].product_name}' добавлен(а) в корзину.
    Кол-во в корзине: ${quantityProduct[0].sum}`

        return await bot.sendMessage(chatId, message, await this.iButtonsProductCard.descriptionButtonsSendingInShoppingCart());
    }

    private async handleEditShoppingCart(chatId: number) {
        let userId: string = String(chatId);
        let message:string = 'Выберете товар для удаления:';

        return await bot.sendMessage(chatId, message, await this.iButtonsProductCard.descriptionButtonsEditingShoppingCart(userId));
    }

    private async handleEditingShoppingCart(chatId: number, text: string[]) {
        let userId: string = String(chatId);
        await this.productRepository.delete1ShoppingCart(text[1], userId);

        return await bot.sendMessage(chatId, 'Позиция удалена', await this.iButtonsProductCard.descriptionButtonsSendingInShoppingCart());
    }

    private async handleClearShoppingCart(chatId: number) {
        let userId: string = String(chatId);
        await this.productRepository.deleteShoppingCart(userId);

        return await bot.sendMessage(chatId, '*Корзина очищена*', await this.iButtonsProductCard.descriptionButtonsSendingInShoppingCart());
    }

    private async handlePlaceAnOrder(chatId: number, firstName:string, userName: string) {
        let userId: string = String(chatId);
        let messageToUser = await this.sendingMessageToUser(chatId);
        let messageToMe = await this.sendingMessageToMe(userId, firstName, userName);
    }

    private async sendingMessageToUser(chatId: number) {
        let message: string = `Ваш заказ оформлен. С вами свяжутся ближайшие 3 дня для согласования места, сроков и способа доставки.
Спасибо за заказ.`

        return await bot.sendMessage(chatId, message);
    }

    private async sendingMessageToMe(userId: string, firstName:string, userName: string) {
        let upUserName = await this.productRepository.recordsIdUserAndUserName(userId, firstName, userName);

        let shoppingCartUser = await this.iShoppingCart.displayShoppingCart(userId);

        let messageToMe: string = `Заказ от пользователя: @${userName}
*Заказ:
${shoppingCartUser}`;

        let delShoppingCartUser = await this.productRepository.deleteShoppingCart(userId);
        return await bot.sendMessage(myTelegramId, messageToMe);
    }
}

async function createMessageInstance() {
    const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
    const productRepository: ProductRepository = new RequestsToDB(databaseRepository);
    const menuRepository: MenuRepository = new MenuButtons(productRepository);
    const iButtonsProductCard: IButtonsProductCard = new ButtonsProductCard(productRepository, menuRepository);
    const figurineCardRepository: FigurineCardRepository = new FigurineCard(productRepository);
    const shoppingCart: IShoppingCart = new ShoppingCart(productRepository);

    const message = new MyBot(menuRepository, figurineCardRepository, productRepository, iButtonsProductCard, shoppingCart);
    return message;
}

createMessageInstance();
