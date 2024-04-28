
class Button {
    reply_markup!: object;
}

export async function creatingMenuButtons(): Promise<Button> {
    return {
        reply_markup: {
            inline_keyboard: [[{ text: 'Список', callback_data: `new` }],
                              [{ text: 'По категориям', callback_data: `new` }],
                              [{ text: 'Мне повезет!', callback_data: `new` }]]
        }
    };
}

 