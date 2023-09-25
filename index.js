//старт - npm run dev
//стоп - 
const fs = require('fs')
const token = '6099977064:AAFUZG73sG4vDn5sPQE0ZQwr_m-hsex4cHQ'
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })

bot.setMyCommands([
    {
        command: '/start',
        description: 'Начальное приветствие'
    },
    {
        command: '/list',
        description: 'Список сообществ'
    },
])

outputMessage()
function outputMessage() {
    bot.on('message', msg => {
        //console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
        }
        if (text === '/list') {
            return bot.sendMessage(chatId, `Список сообществ: `, arrayCommunities);
        }
        return bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', msg => {//ответ на кнопку '/list'
        const data = msg.data;
        const chatId = msg.message.chat.id;
        switch (data) {
            case "8989":
                bot.sendMessage(chatId, `8888888`);
                break;
            case "89":
                bot.sendMessage(chatId, `77777777`);
                break;
        }
    })
}

const arrayCommunities = {//подключение для кнопок '/list'
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: `5454`, callback_data: '8989' }],
            [{ text: 'текст', callback_data: '89' }]
        ]
    })
}
