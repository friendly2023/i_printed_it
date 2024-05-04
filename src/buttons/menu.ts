import {
    Product,
    CategoriesLeft,
    ProductsCatalog,
    CategoryName,
    respondsToMenuListProductNameId,
    respondsToMenuListCategoryNameLeft,
    respondsToMenuListByCategory,
    respondsToMenuListCategoryName,
    respondsToMenuListProductNameIdSubcategory
} from '../DB/requestsToDB';

class Button {
    reply_markup!: object;
}

interface InlineKeyboardButton {
    text: string;
    callback_data: string;
}

interface ReplyMarkup {
    reply_markup: {
        inline_keyboard: InlineKeyboardButton[][];
    };
}

//общие
async function creatingInlineKeyboardButton(keys1: string, keys2: string, data: any, callbackToken?: string): Promise<ReplyMarkup> {
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

async function getRandomNumber(min: number, max: number): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//отработка кнопки меню
export async function creatingMenuButtons(): Promise<ReplyMarkup> {
    return {
        reply_markup: {
            inline_keyboard: [[{ text: 'Список', callback_data: `menuList` }],
                              [{ text: 'По категориям', callback_data: `menuCategories` }],
                              [{ text: 'Мне повезет!', callback_data: `luckyMe` }]]
        }
    };
}

// отработка кнопки СПИСОК
export async function creatingMenuListProductNameIdButtons(): Promise<ReplyMarkup> {
    let resultRequest: Product[] = await respondsToMenuListProductNameId();
    let keys = Object.keys(resultRequest[0]);
    return await creatingInlineKeyboardButton(keys[0], keys[1], resultRequest);
}

//отработка кнопки ПО КАТЕГОРИЯМ
async function rebuildingArrCategories(): Promise<CategoriesLeft[]> {
    let resultRequest: CategoriesLeft[] = await respondsToMenuListCategoryNameLeft();
    const sortedData = resultRequest.sort((a, b) => {
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

export async function creatingMenuListCategoryNameLeftButtons(): Promise<ReplyMarkup> {
    let resultRequest: CategoriesLeft[] = await rebuildingArrCategories();
    const keys = Object.keys(resultRequest[0]);
    return await creatingInlineKeyboardButton(keys[0], keys[0], resultRequest, 'menuCategories//');
}

//отработка кнопки МНЕ ПОВЕЗЕТ
export async function selectionRandomProduct(): Promise<string> {
    let resultRequest: Product[] = await respondsToMenuListProductNameId();
    let randomNumber: number = await getRandomNumber(1, resultRequest.length - 1);
    return resultRequest[randomNumber].product_id
}

//отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория*
export async function creatingMenuListByCategoryButtons(categoryNameLeft: string): Promise<ReplyMarkup> {
    let resultRequest: ProductsCatalog[] = await respondsToMenuListByCategory(categoryNameLeft);
    const dataFirstButton: ProductsCatalog = {
        product_name: `Раскрыть категорию *${categoryNameLeft}*`, product_id: `subcategories//${categoryNameLeft}`,
        category_name_left: '',
        category_name: ''
    };
    let keys = Object.keys(resultRequest[0]);
    resultRequest.unshift(dataFirstButton);
    return await creatingInlineKeyboardButton(keys[1], keys[0], resultRequest);
}

//отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории'
export async function creatingMenuListCategoryNameButtons(categoryNameLeft: string): Promise<ReplyMarkup> {
    let resultRequest: CategoryName[] = await respondsToMenuListCategoryName(categoryNameLeft);
    let keys = Object.keys(resultRequest[0]);
    return await creatingInlineKeyboardButton(keys[0], keys[0], resultRequest, 'menuCategoriesTwo//');
}

//отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории' - развернутая подкатегория
export async function creatingMenuListProductNameIdSubcategoryButtons(categoryName: string): Promise<ReplyMarkup> {
    let resultRequest: Product[] = await respondsToMenuListProductNameIdSubcategory(categoryName);
    let keys = Object.keys(resultRequest[0]);
    return await creatingInlineKeyboardButton(keys[1], keys[0], resultRequest);
}