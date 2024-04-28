import { SelectResultDB, respondsToMenuList } from '../DB/requestsToDB';

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

async function requestMenuList(indicator: string): Promise<SelectResultDB[]> {//вывод запроса в переменную
    let selectResult: SelectResultDB[] = await respondsToMenuList(indicator);
    return selectResult
}

async function creatingMenuListArr(indicator: string): Promise<string[]> {//получен массив продуктов
    let resultRequest: SelectResultDB[] = await requestMenuList(indicator);
    let menuList: string[] = [];
    if (indicator === 'product_name') {
        for (let i = 0; i < resultRequest.length; i++) {
            menuList.push(resultRequest[i].product_name);
        }
    } else {
        for (let i = 0; i < resultRequest.length; i++) {
            menuList.push(resultRequest[i].product_id);
        }
    }
    return menuList
}

async function creatingMenuListArrButtons(): Promise<object[]> {
    let menuListArrProductName: string[] = await creatingMenuListArr('product_name');
    let menuListArrProductId: string[] = await creatingMenuListArr('product_id');
    let buttonsArray: object[] = []
    for (let i = 0; i < menuListArrProductName.length; i++) {
        buttonsArray.push([{ text: menuListArrProductName[i], callback_data: menuListArrProductId[i] }])
    }
    return buttonsArray
}

export async function creatingMenuListButtons(): Promise<Button> {
    let buttonsArray: object[] = await creatingMenuListArrButtons();
    return { reply_markup: { inline_keyboard: buttonsArray } }
}
