import { SelectResultDB, respondsToMenuListProductNameId } from '../DB/requestsToDB';

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

async function creatingMenuListProductNameIdArrButtons(): Promise<object[]> {
    let resultRequest: SelectResultDB[] = await respondsToMenuListProductNameId();
    let buttonsArray: object[] = []
    for (let i = 0; i < resultRequest.length; i++) {
        buttonsArray.push([{ text: resultRequest[i].product_name, callback_data: resultRequest[i].product_id }])
    }
    return buttonsArray
}

export async function creatingMenuListProductNameIdButtons(): Promise<Button> {
    let buttonsArray: object[] = await creatingMenuListProductNameIdArrButtons();
    return { reply_markup: { inline_keyboard: buttonsArray } }
}

// export async function rebuildingArrayCategories(): Promise<string[]> {
//     let oldArr: string[] = await creatingMenuListArr('category_name_left');
//     return oldArr.filter(a => a !== 'Другое').concat('Другое');
// }

// async function creatingMenuListArrButtonsСategory() {
//     let menuListArrCategoryNameLeft: string[] = await rebuildingArrayCategories();
//     let buttonsArray: object[] = []
//     for (let i = 0; i < menuListArrCategoryNameLeft.length; i++) {
//         buttonsArray.push([{ text: menuListArrCategoryNameLeft[i], callback_data: `menuCategories//${menuListArrCategoryNameLeft[i]}` }])
//     }
//     return buttonsArray
// }

// export async function creatingMenuListButtonsСategory(): Promise<Button> {
//     let buttonsArray: object[] = await creatingMenuListArrButtonsСategory();
//     return { reply_markup: { inline_keyboard: buttonsArray } }
// }
