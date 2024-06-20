import {
    RequestsToDB,
    Product,
    CategoriesLeft,
    ProductsCatalog,
    CategoryName,
    ProductRepository,
    ProductsDescription2
} from '../DB/requestsToDB';

class InlineKeyboardButton {
    text!: string;
    callback_data!: string;
}

export class ReplyMarkup {
    reply_markup!: {
        inline_keyboard: InlineKeyboardButton[][];
    };
}

export interface MenuRepository {
    creatingMenuButtons(): Promise<ReplyMarkup>;
    creatingMenuListProductNameIdButtons(): Promise<ReplyMarkup>;
    creatingMenuListCategoryNameLeftButtons(): Promise<ReplyMarkup>;
    selectionRandomProduct(): Promise<string>;
    creatingMenuListByCategoryButtons(categoryNameLeft: string): Promise<ReplyMarkup>;
    creatingMenuListCategoryNameButtons(categoryNameLeft: string): Promise<ReplyMarkup>;
    creatingMenuListProductNameIdSubcategoryButtons(categoryName: string): Promise<ReplyMarkup>;
    creatingFigurineCardButtons(productId: string): Promise<[string, string, ReplyMarkup]>;
}

export class MenuButtons implements MenuRepository {

    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    //создание кнопки
    private async creatingInlineKeyboardButton(keys1: string, keys2: string, data: any, callbackToken?: string): Promise<ReplyMarkup> {
        return new Promise((resolve) => {
            const inlineKeyboard: InlineKeyboardButton[][] = data.map((item: any) => [
                {
                    text: item[keys1],
                    callback_data: `${callbackToken || ''}${item[keys2]}`,
                },
            ]);

            const replyMarkup: ReplyMarkup = {
                reply_markup: {
                    inline_keyboard: inlineKeyboard,
                },
            };

            resolve(replyMarkup);
        });
    }

    //рандомайзер
    private async getRandomNumber(min: number, max: number): Promise<number> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //отработка кнопки меню
    async creatingMenuButtons(): Promise<ReplyMarkup> {
        return {
            reply_markup: {
                inline_keyboard: [[{ text: 'Список', callback_data: `menuList` }],
                [{ text: 'По категориям', callback_data: `menuCategories` }],
                [{ text: 'Мне повезет!', callback_data: `luckyMe` }]]
            }
        };
    }

    // отработка кнопки СПИСОК
    async creatingMenuListProductNameIdButtons(): Promise<ReplyMarkup> {
        let result: Product[] = await this.productRepository.respondsToMenuListProductNameId();
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[1], result);
    }

    //отработка кнопки ПО КАТЕГОРИЯМ
    private async rebuildingArrCategories(): Promise<CategoriesLeft[]> {
        let result: CategoriesLeft[] = await this.productRepository.respondsToMenuListCategoryNameLeft();
        const sortedData = result.sort((a, b) => {
            if (a.category_name_left === 'Другое') {
                return 1;
            } else if (b.category_name_left === 'Другое') {
                return -1;
            } else {
                return 0;
            }
        });
        return sortedData
    }

    async creatingMenuListCategoryNameLeftButtons(): Promise<ReplyMarkup> {
        let resultRequest: CategoriesLeft[] = await this.rebuildingArrCategories();
        const keys = Object.keys(resultRequest[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[0], resultRequest, 'menuCategoriesOpen//');
    }

    //отработка кнопки МНЕ ПОВЕЗЕТ
    async selectionRandomProduct(): Promise<string> {
        let result: Product[] = await this.productRepository.respondsToMenuListProductNameId();
        let randomNumber: number = await this.getRandomNumber(1, result.length - 1);
        return result[randomNumber].product_id;
    }

    //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория*
    async creatingMenuListByCategoryButtons(categoryNameLeft: string): Promise<ReplyMarkup> {
        let result: ProductsCatalog[] = await this.productRepository.respondsToMenuListByCategory(categoryNameLeft);
        const dataFirstButton: ProductsCatalog = {
            product_name: `Раскрыть категорию *${categoryNameLeft}*`, product_id: `subcategories//${categoryNameLeft}`,
            category_name_left: '',
            category_name: ''
        };
        let keys = Object.keys(result[0]);
        result.unshift(dataFirstButton);
        return this.creatingInlineKeyboardButton(keys[1], keys[0], result);
    }

    //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории'
    async creatingMenuListCategoryNameButtons(categoryNameLeft: string): Promise<ReplyMarkup> {
        let result: CategoryName[] = await this.productRepository.respondsToMenuListCategoryName(categoryNameLeft);
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[0], result, 'menuCategoriesTwo//');
    }

    //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории' - развернутая подкатегория
    async creatingMenuListProductNameIdSubcategoryButtons(categoryName: string): Promise<ReplyMarkup> {
        let result: Product[] = await this.productRepository.respondsToMenuListProductNameIdSubcategory(categoryName);
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[1], keys[0], result);
    }

    //кнопки для карточки товара - сообщение 2
    async creatingFigurineCardButtons(productId: string): Promise<[string, string, ReplyMarkup]> {
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