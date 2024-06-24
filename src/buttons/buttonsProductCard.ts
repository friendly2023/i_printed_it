import { ProductRepository, ProductsDescription2 } from "../DB/requestsToDB";
import { InlineKeyboardButton, ReplyMarkup } from "./buttonsMenu";

export interface IButtonsProductCard {
    creatingBasicButtons(productId: string): Promise<[string, string, ReplyMarkup]>;
    creatingButtonsRating(productId: string): Promise<ReplyMarkup>;
    creatingButtonsBack(productId: string): Promise<ReplyMarkup>;
    descriptionButtonsBack(productId: string): Promise<InlineKeyboardButton>;
    descriptionButtonsInShoppingCart(productId: string): Promise<InlineKeyboardButton>;
}

export class ButtonsProductCard implements IButtonsProductCard {

    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    //кнопки для карточки товара - сообщение 2
    async creatingBasicButtons(productId: string): Promise<[string, string, ReplyMarkup]> {
        let result: ProductsDescription2[] = await this.productRepository.respondsProductCard2(productId);
        let categoryNameLeft: string = result[0].category_name_left;
        let categoryName: string = result[0].category_name;
        
        let arrayButtons: ReplyMarkup = {
            reply_markup: {
                inline_keyboard: [[{ text: '➡️ Подробнее', callback_data: `more//${productId}` }],
                                  [{ text: '⭐️ Оценить', callback_data: `feedback//${productId}` }],
                                  [await this.descriptionButtonsInShoppingCart(productId)]]
            }
        };
        return [categoryNameLeft, categoryName, arrayButtons]
    }

    async creatingButtonsRating(productId: string): Promise<ReplyMarkup> {
        return {
            reply_markup: {
                inline_keyboard: [[{ text: '⭐️1', callback_data: `newrating//1//${productId}` },
                                   { text: '⭐️2', callback_data: `newrating//2//${productId}` },
                                   { text: '⭐️3', callback_data: `newrating//3//${productId}` },
                                   { text: '⭐️4', callback_data: `newrating//4//${productId}` },
                                   { text: '⭐️5', callback_data: `newrating//5//${productId}` }],
                                   [await this.descriptionButtonsBack(productId)]]
            }
        };
    }

    async creatingButtonsBack(productId: string): Promise<ReplyMarkup> {
        return {
            reply_markup: {
                inline_keyboard: [[await this.descriptionButtonsBack(productId)]]
            }
        };
    }

    async descriptionButtonsBack(productId: string): Promise<InlineKeyboardButton> {
        return { text: 'Назад', callback_data: `${productId}` }
    }

    async descriptionButtonsInShoppingCart(productId: string): Promise<InlineKeyboardButton> {
        return { text: '🛒 Отправить в корзину', callback_data: `inShoppingCart//${productId}` }
    }
}