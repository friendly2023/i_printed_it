import { ProductRepository, ProductsPhoto } from "../../DB/requestsToDB";
import { FigurineCard } from "../../productCard/figurineСard";


describe('FigurineCard', () => {
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