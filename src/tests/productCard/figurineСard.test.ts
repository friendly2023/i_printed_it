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
            respondsProductCard: jest.fn().mockResolvedValue([
                { product_name: 'Product A', product_description: 'description1', price: '1000' },
            ])
        };

        figurineCard = new FigurineCard('testProductId', productRepository as ProductRepository);
    });

    it('должен быть возвращен массив фотографий с добавленной подписью', async () => {
        const result = await figurineCard.writingMessageToPhoto();

        expect(result).toEqual([
            {
                type: 'photo',
                caption: '"Product A"\nОписание: description1\nСтоимость: 1000 Р',
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