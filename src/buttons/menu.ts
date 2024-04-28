
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

 