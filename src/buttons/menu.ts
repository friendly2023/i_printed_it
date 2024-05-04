import {
    SelectResultDB,
    Product,
    CategoriesLeft,
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

// export async function creatingMenuButtons(): Promise<Button> {
//     let randomProduct = await selectionRandomProduct();
//     return {
//         reply_markup: {
//             inline_keyboard: [[{ text: 'Список', callback_data: `menuList` }],
//                               [{ text: 'По категориям', callback_data: `menuCategories` }],
//                               [{ text: 'Мне повезет!', callback_data: `luckyMe//${randomProduct}` }]]
//         }
//     };
// }

async function creatingInlineKeyboardButton(keys1: string, keys2: string, data: any, callbackToken?: string) {
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

        resolve(inlineKeyboard);
    });
}
// отработка кнопки СПИСОК
export async function creatingMenuListProductNameIdButtons() {
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

export async function creatingMenuListCategoryNameLeftButtons() {
    let resultRequest: CategoriesLeft[] = await rebuildingArrCategories();
    const keys = Object.keys(resultRequest[0]);
    return await creatingInlineKeyboardButton(keys[0], keys[0], resultRequest, 'menuCategories//');
}
// //отработка кнопки МНЕ ПОВЕЗЕТ
// async function getRandomNumber(min: number, max: number): Promise<number> {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// async function selectionRandomProduct() {
//     let resultRequest: SelectResultDB[] = await respondsToMenuListProductNameId();
//     let randomNumber = await getRandomNumber(1, resultRequest.length - 1);
//     return resultRequest[randomNumber].product_id
// }
// //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория*
// async function creatingMenuListByCategoryArrButtons(categoryNameLeft: string): Promise<object[]> {
//     let resultRequest: SelectResultDB[] = await respondsToMenuListByCategory(categoryNameLeft);
//     let buttonsArray: object[] = [[{ text: `Раскрыть категорию *${categoryNameLeft}*`, callback_data: `subcategories//${categoryNameLeft}` }]];
//     for (let i = 0; i < resultRequest.length; i++) {
//         buttonsArray.push([{ text: resultRequest[i].product_name, callback_data: resultRequest[i].product_id }])
//     }
//     return buttonsArray
// }

// export async function creatingMenuListByCategoryButtons(categoryNameLeft: string): Promise<Button> {
//     let buttonsArray: object[] = await creatingMenuListByCategoryArrButtons(categoryNameLeft);
//     return { reply_markup: { inline_keyboard: buttonsArray } }
// }
// //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории'
// async function creatingMenuListCategoryNameArrButtons(categoryNameLeft: string): Promise<object[]> {
//     let resultRequest: SelectResultDB[] = await respondsToMenuListCategoryName(categoryNameLeft);
//     let buttonsArray: object[] = [];
//     for (let i = 0; i < resultRequest.length; i++) {
//         buttonsArray.push([{ text: resultRequest[i].category_name, callback_data: `menuCategoriesTwo//${resultRequest[i].category_name}` }])
//     }
//     return buttonsArray
// }

// export async function creatingMenuListCategoryNameButtons(categoryNameLeft: string): Promise<Button> {
//     let buttonsArray: object[] = await creatingMenuListCategoryNameArrButtons(categoryNameLeft);
//     return { reply_markup: { inline_keyboard: buttonsArray } }
// }
// //отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория* - 'подкатегории' - развернутая подкатегория
// async function creatingMenuListProductNameIdSubcategoryArrButtons(categoryName: string): Promise<object[]> {
//     let resultRequest: SelectResultDB[] = await respondsToMenuListProductNameIdSubcategory(categoryName);
//     let buttonsArray: object[] = [];
//     for (let i = 0; i < resultRequest.length; i++) {
//         buttonsArray.push([{ text: resultRequest[i].product_name, callback_data: resultRequest[i].product_id }])
//     }
//     return buttonsArray
// }

// export async function creatingMenuListProductNameIdSubcategoryButtons(categoryNameLeft: string): Promise<Button> {
//     let buttonsArray: object[] = await creatingMenuListProductNameIdSubcategoryArrButtons(categoryNameLeft);
//     return { reply_markup: { inline_keyboard: buttonsArray } }
// }