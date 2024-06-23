import { ProductRepository, ProductsDescription2 } from "../DB/requestsToDB";
import { ReplyMarkup } from "./buttonsMenu";

export interface IButtonsProductCard {
    creatingBasicButtons(productId: string): Promise<[string, string, ReplyMarkup]>;
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
                                  [{ text: '⭐️ Оценить', callback_data: `feedback//${productId}` }]]
            }
        };
        return [categoryNameLeft, categoryName, arrayButtons]
    }
}