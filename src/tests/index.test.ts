import TelegramApi, { Message } from 'node-telegram-bot-api';
import { MyBot } from '../index'
import { ProductRepository, RequestsToDB } from '../DB/requestsToDB';
import { MenuRepository, ReplyMarkup } from '../buttons/menu';
import { FigurineCardRepository } from '../productCard/figurineСard';
import { token } from '../serviceKey/telegramKey';


describe('Message', () => {
  let bot: TelegramApi;
  let onTextMock: jest.Mock;
  let sendMessageMock: jest.Mock;
  let menuRepositoryMock: MenuRepository;
  let figurineCardRepositoryMock: FigurineCardRepository;
  let productRepositoryMock: ProductRepository;

  beforeEach(() => {
    // bot = new TelegramApi(token, { polling: true });
    onTextMock = jest.fn();
    sendMessageMock = jest.fn();

    menuRepositoryMock = {
      creatingMenuButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListProductNameIdButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListCategoryNameLeftButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      selectionRandomProduct: jest.fn().mockReturnValue(Promise.resolve('Случайный продукт')),
      creatingMenuListByCategoryButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListCategoryNameButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListProductNameIdSubcategoryButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup))
    };

    figurineCardRepositoryMock = {
      writingMessageToPhoto: jest.fn().mockReturnValue(
        Promise.resolve([
          {
            type: 'photo',
            caption: 'Фото 1',
            media: 'https://example.com/photo1.jpg'
          },
          {
            type: 'photo',
            caption: 'Фото 2',
            media: 'https://example.com/photo2.jpg'
          },
          {
            type: 'photo',
            caption: 'Фото 3',
            media: 'https://example.com/photo3.jpg'
          }
        ])
      )
    };

    productRepositoryMock = {
      respondsToMenuListProductNameId: jest.fn().mockReturnValue(
        Promise.resolve([
          { product_id: '1', product_name: 'Product A' },
          { product_id: '2', product_name: 'Product B' },
          { product_id: '3', product_name: 'Product C' },
        ])
      ),
      respondsToMenuListCategoryNameLeft: jest.fn().mockReturnValue(
        Promise.resolve([
          { category_name_left: 'CategoryL A' },
          { category_name_left: 'CategoryL B' },
          { category_name_left: 'CategoryL C' },
        ])
      ),
      respondsToMenuListByCategory: jest.fn().mockReturnValue(// запрос CategoryL A
        Promise.resolve([
          { product_id: '1', product_name: 'Product A', category_name_left: 'CategoryL A', category_name: 'Category A' },
          { product_id: '2', product_name: 'Product B', category_name_left: 'CategoryL A', category_name: 'Category B' },
          { product_id: '3', product_name: 'Product C', category_name_left: 'CategoryL A', category_name: 'Category A' },
        ])
      ),
      respondsToMenuListCategoryName: jest.fn().mockReturnValue(//запрос CategoryL A
        Promise.resolve([
          { category_name: 'Category A' },
          { category_name: 'Category B' },
          { category_name: 'Category C' },
        ])
      ),
      respondsToMenuListProductNameIdSubcategory: jest.fn().mockReturnValue(//запрос CategoryL A
        Promise.resolve([
          { product_id: '1', product_name: 'Product A' },
          { product_id: '2', product_name: 'Product B' },
          { product_id: '3', product_name: 'Product C' },
        ])
      ),
      respondsImagePath: jest.fn().mockReturnValue(
        Promise.resolve([
          { image_path: 'Path 1' },
          { image_path: 'Path 2' },
          { image_path: 'Path 3' },
        ])
      ),
      respondsProductCard: jest.fn().mockReturnValue(
        Promise.resolve([
          { product_name: 'Product A', product_description: 'Description A', price: '1000' }
        ])
      )
    };

    jest.spyOn(bot, 'onText').mockImplementation(onTextMock);
    jest.spyOn(bot, 'sendMessage').mockImplementation(sendMessageMock);
  });


    
  it('должен обрабатывать команду /start', async () => {
    const yourBot = new MyBot(bot, menuRepositoryMock, figurineCardRepositoryMock, productRepositoryMock);
  
    // Имитируем получение сообщения с командой /start
    const update = {
      update_id: 123,
      message: {
        message_id: 456,
        from: {
          id: 789,
          is_bot: false,
          first_name: 'John',
          username: 'john_doe'
        },
        chat: {
          id: 123,
          first_name: 'John',
          username: 'john_doe',
          type: 'private'
        },
        date: 1618903200,
        text: '/start'
      }
    };
  
    // Вызываем метод, который запускает обработку сообщений
    await yourBot.outputMessage();
  
    // Проверяем, что бот отправил ожидаемое сообщение
    expect(bot.sendMessage).toHaveBeenCalledWith(123, expect.stringContaining('Добро пожаловать в наш интернет-магазин! Для перехода в меню, отправьте команду /menu'));
  });
  
  
  
  

  // it('должен обрабатывать команду /menu', () => {
  //   const fakeMessage = { chat: { id: 456 } } as Message;
  //   onTextMock.mockImplementationOnce((regex, callback) => {
  //     callback(fakeMessage, '/menu');
  //   });

  //   const yourBot = new YourBot(bot, menuRepositoryMock, figurineCardRepositoryMock, productRepositoryMock);
  //   yourBot.outputMessage();

  //   expect(sendMessageMock).toHaveBeenCalledWith(456, 'Вот меню...');
  // });
});
