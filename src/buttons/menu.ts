import {
    SelectResultDB,
    respondsToMenuListProductNameId,
    respondsToMenuListCategoryNameLeft,
    respondsToMenuListCategoryName
} from '../DB/requestsToDB';

class Button {
    reply_markup!: object;
}

export async function creatingMenuButtons(): Promise<Button> {
    return {
        reply_markup: {
            inline_keyboard: [[{ text: 'Список', callback_data: `menuList` }],
            [{ text: 'По категориям', callback_data: `menuCategories` }],
            [{ text: 'Мне повезет!', callback_data: `menuLike` }]]
        }
    };
}
// отработка кнопки СПИСОК
async function creatingMenuListProductNameIdArrButtons(): Promise<object[]> {
    let resultRequest: SelectResultDB[] = await respondsToMenuListProductNameId();
    let buttonsArray: object[] = [];
    for (let i = 0; i < resultRequest.length; i++) {
        buttonsArray.push([{ text: resultRequest[i].product_name, callback_data: resultRequest[i].product_id }])
    }
    return buttonsArray
}

export async function creatingMenuListProductNameIdButtons(): Promise<Button> {
    let buttonsArray: object[] = await creatingMenuListProductNameIdArrButtons();
    return { reply_markup: { inline_keyboard: buttonsArray } }
}
//отработка кнопки ПО КАТЕГОРИЯМ
async function rebuildingArrCategories(): Promise<string[]> {
    let resultRequest: SelectResultDB[] = await respondsToMenuListCategoryNameLeft();
    let oldArr: string[] = [];
    for (let i = 0; i < resultRequest.length; i++) {
        oldArr.push(resultRequest[i].category_name_left)
    }
    return oldArr.filter(a => a !== 'Другое').concat('Другое');
}

async function creatingMenuListCategoryNameLeftArrButtons() {
    let menuListArrCategoryNameLeft: string[] = await rebuildingArrCategories();
    let buttonsArray: object[] = []
    for (let i = 0; i < menuListArrCategoryNameLeft.length; i++) {
        buttonsArray.push([{ text: menuListArrCategoryNameLeft[i], callback_data: `menuCategories//${menuListArrCategoryNameLeft[i]}` }])
    }
    return buttonsArray
}

export async function creatingMenuListCategoryNameLeftButtons(): Promise<Button> {
    let buttonsArray: object[] = await creatingMenuListCategoryNameLeftArrButtons();
    return { reply_markup: { inline_keyboard: buttonsArray } }
}
//отработка кнопки ПО КАТЕГОРИЯМ - *выбранная категория*
async function creatingMenuListCategoryNameArrButtons(categoryNameLeft: string): Promise<object[]> {
    let resultRequest: SelectResultDB[] = await respondsToMenuListCategoryName(categoryNameLeft);
    let buttonsArray: object[] = [];
    for (let i = 0; i < resultRequest.length; i++) {
        buttonsArray.push([{ text: resultRequest[i].category_name, callback_data: `menuCategoriesTwo//${resultRequest[i].category_name}` }])
    }
    return buttonsArray
}

export async function creatingMenuListButtonsСategory(categoryNameLeft: string): Promise<Button> {
    let buttonsArray: object[] = await creatingMenuListCategoryNameArrButtons(categoryNameLeft);
    return { reply_markup: { inline_keyboard: buttonsArray } }
}
