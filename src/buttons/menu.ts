import {
    RequestsToDB,
    Product,
    CategoriesLeft,
    ProductsCatalog,
    CategoryName
} from '../DB/requestsToDB';

class InlineKeyboardButton {
    text!: string;
    callback_data!: string;
}

class ReplyMarkup {
    reply_markup!: {
        inline_keyboard: InlineKeyboardButton[][];
    };
}

export class MenuButtons {

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
        let requestsToDB = new RequestsToDB();
        let result: Product[] = await requestsToDB.respondsToMenuListProductNameId();
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[1], result);
    }

    //отработка кнопки ПО КАТЕГОРИЯМ
    private async rebuildingArrCategories(): Promise<CategoriesLeft[]> {
        let requestsToDB = new RequestsToDB();
        let result: CategoriesLeft[] = await requestsToDB.respondsToMenuListCategoryNameLeft();
        const sortedData = result.sort((a, b) => {
            if (a.category_name_left === 'Другое') {
                return 1; // Переместить объект 'Другое' в конец
            } else if (b.category_name_left === 'Другое') {
                return -1; // Переместить объект 'Другое' в конец
            } else {
                return 0; // Оставить остальные объекты на своих местах
            }
        });
        return sortedData
    }

    async creatingMenuListCategoryNameLeftButtons(): Promise<ReplyMarkup> {
        let resultRequest: CategoriesLeft[] = await this.rebuildingArrCategories();
        const keys = Object.keys(resultRequest[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[0], resultRequest, 'menuCategories//');
    }

    //отработка кнопки МНЕ ПОВЕЗЕТ
    async selectionRandomProduct(): Promise<string> {
        let requestsToDB = new RequestsToDB();
        let result: Product[] = await requestsToDB.respondsToMenuListProductNameId();
        let randomNumber: number = await this.getRandomNumber(1, result.length - 1);
        return result[randomNumber].product_id;
    }

    //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория*
    async creatingMenuListByCategoryButtons(categoryNameLeft: string): Promise<ReplyMarkup> {
        let requestsToDB = new RequestsToDB();
        let result: ProductsCatalog[] = await requestsToDB.respondsToMenuListByCategory(categoryNameLeft);
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
        let requestsToDB = new RequestsToDB();
        let result: CategoryName[] = await requestsToDB.respondsToMenuListCategoryName(categoryNameLeft);
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[0], keys[0], result, 'menuCategoriesTwo//');
    }

    //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории' - развернутая подкатегория
    async creatingMenuListProductNameIdSubcategoryButtons(categoryName: string): Promise<ReplyMarkup> {
        let requestsToDB = new RequestsToDB();
        let result: Product[] = await requestsToDB.respondsToMenuListProductNameIdSubcategory(categoryName);
        let keys = Object.keys(result[0]);
        return this.creatingInlineKeyboardButton(keys[1], keys[0], result);
    }
}