import TelegramApi, { Message } from 'node-telegram-bot-api';
import { MyBot } from '../index'
import { ProductRepository, RequestsToDB } from '../DB/requestsToDB';
import { MenuRepository, ReplyMarkup } from '../buttons/menu';
import { FigurineCardRepository } from '../productCard/figurineСard';

describe('MyBot', () => {
  let myBot: MyBot;
  let mockMenuRepository: jest.Mocked<MenuRepository>;
  let mockFigurineCardRepository: jest.Mocked<FigurineCardRepository>;
  let mockProductRepository: jest.Mocked<ProductRepository>;
  let mockSendMessage: jest.Mock;
  let mockOnMessage: jest.Mock;

  beforeEach(() => {
    mockMenuRepository = {
      creatingMenuButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListProductNameIdButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListCategoryNameLeftButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      selectionRandomProduct: jest.fn().mockReturnValue(Promise.resolve('Случайный продукт')),
      creatingMenuListByCategoryButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListCategoryNameButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup)),
      creatingMenuListProductNameIdSubcategoryButtons: jest.fn().mockReturnValue(Promise.resolve({} as ReplyMarkup))
    };

    mockFigurineCardRepository = {
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

    mockProductRepository = {
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

    mockSendMessage = jest.fn();
    mockOnMessage = jest.fn();

    myBot = new MyBot(mockMenuRepository, mockFigurineCardRepository, mockProductRepository);
    myBot.bot = { on: mockOnMessage, sendMessage: mockSendMessage };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('outputMessage', () => {
    it('should handle /start command', async () => {
      const mockMessage = { text: '/start', chat: { id: 123 } };
      const handleStartSpy = jest.spyOn(myBot as any, 'handleStart');

      await myBot.outputMessage();

      expect(mockOnMessage).toHaveBeenCalledWith('message', expect.any(Function));
      const messageHandler = mockOnMessage.mock.calls[0][1];
      await messageHandler(mockMessage);

      expect(handleStartSpy).toHaveBeenCalledWith(mockMessage.chat.id);
      expect(mockSendMessage).toHaveBeenCalledWith(mockMessage.chat.id, expect.any(String));
    });
  });

  describe('handleStart', () => {
    it('should send a welcome message', async () => {
      const chatId = 123;

      await myBot['handleStart'](chatId);

      expect(mockSendMessage).toHaveBeenCalledWith(chatId, expect.any(String));
    });
  });
});