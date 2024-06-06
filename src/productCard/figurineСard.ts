import {
    RequestsToDB,
    ProductsPhoto,
    ProductsDescription,
    ProductRepository,
} from '../DB/requestsToDB';

class ArrayPhotos {
    type!: string;
    caption?: string;
    media!: string;
}

export interface FigurineCardRepository {
    writingMessageToPhoto(productId: string): Promise<ArrayPhotos[]>;
}

export class FigurineCard implements FigurineCardRepository {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    private async resultRespondsImagePath(productId: string): Promise<ProductsPhoto[]> {
        return await this.productRepository.respondsImagePath(productId);
    }

    private async resultProductCard(productId: string): Promise<ProductsDescription[]> {
        return await this.productRepository.respondsProductCard(productId);
    }

    async writingMessageToPhoto(productId: string): Promise<ArrayPhotos[]> {
        let result = await this.resultProductCard(productId);
        let messageToPhoto: string = `"${result[0].product_name}"
Описание: ${result[0].product_description}
Стоимость: ${result[0].price} Р`;

        return (await this.resultRespondsImagePath(productId)).map((item, index) => {
            if (index === 0) {
                return {
                    type: 'photo',
                    caption: messageToPhoto,
                    media: item.image_path
                };
            } else {
                return {
                    type: 'photo',
                    media: item.image_path
                };
            }
        });
    }
}