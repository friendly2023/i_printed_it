import { ProductRepository, ProductsPhoto } from "../../DB/requestsToDB";
import { FigurineCard } from "../../productCard/figurineСard";


describe('FigurineCard с оценками', () => {
    let figurineCard: FigurineCard;
    let productRepository: Partial<ProductRepository>;

    beforeEach(() => {
        productRepository = {
            respondsImagePath: jest.fn().mockResolvedValue([
                { image_path: "path1" },
                { image_path: "path2" },
                { image_path: "path3" },
            ]),
            respondsProductCard1: jest.fn().mockResolvedValue([
                { product_name: 'Product A', price: '1000'},
            ]),
            respondsFeedbackRating: jest.fn().mockResolvedValue([
                { rating: 5 }, { rating: 4 }
            ])
        };

        figurineCard = new FigurineCard(productRepository as ProductRepository);
    });

    it('должен быть возвращен массив фотографий с добавленной подписью', async () => {
        const result = await figurineCard.writingMessageToPhoto('testProductId');
        let message = `'Product A'

⭐️ 4.5 / 5

💰 1000`;

        expect(result).toEqual([
            {
                type: 'photo',
                caption: message,
                media: 'path1'
            },
            {
                type: 'photo',
                media: 'path2'
            },
            {
                type: 'photo',
                media: 'path3'
            }
        ]);
    });
})

describe('FigurineCard без оценок', () => {
    let figurineCard: FigurineCard;
    let productRepository: Partial<ProductRepository>;

    beforeEach(() => {
        productRepository = {
            respondsImagePath: jest.fn().mockResolvedValue([
                { image_path: "path1" },
                { image_path: "path2" },
                { image_path: "path3" },
            ]),
            respondsProductCard1: jest.fn().mockResolvedValue([
                { product_name: 'Product A', price: '1000'},
            ]),
            respondsFeedbackRating: jest.fn().mockResolvedValue([
            ])
        };

        figurineCard = new FigurineCard(productRepository as ProductRepository);
    });

    it('должен быть возвращен массив фотографий с добавленной подписью', async () => {
        const result = await figurineCard.writingMessageToPhoto('testProductId');
        let message = `'Product A'

⭐️ 0 / 0

💰 1000`;

        expect(result).toEqual([
            {
                type: 'photo',
                caption: message,
                media: 'path1'
            },
            {
                type: 'photo',
                media: 'path2'
            },
            {
                type: 'photo',
                media: 'path3'
            }
        ]);
    });
})

describe('FigurineCard вызов описания', () => {
    let figurineCard: FigurineCard;
    let productRepository: Partial<ProductRepository>;

    beforeEach(() => {
        productRepository = {
            respondsDescription: jest.fn().mockResolvedValue([
                {
                    product_description: 'Описание'
                }
            ]),
            respondsProductName: jest.fn().mockResolvedValue([
                {
                    product_name: 'Набор для НРИ - Таверна'
                }
            ])
        };

        figurineCard = new FigurineCard(productRepository as ProductRepository);
    });

    it('должен быть возвращено описани продукта', async () => {
        const productId = 'testProductId';
        const result = await figurineCard.writingMessageWithDescription(productId);
        
        let message: string = `'Набор для НРИ - Таверна'
➡️ Описание:
Описание`;

        expect(result).toEqual(message);
    });
})
