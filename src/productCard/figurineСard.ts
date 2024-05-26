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
    writingMessageToPhoto(): Promise<ArrayPhotos[]>;
}

export class FigurineCard implements FigurineCardRepository {
    private productRepository: ProductRepository;

    constructor(public productId: string, productRepository: ProductRepository) {
        this.productId = productId;
        this.productRepository = productRepository;
    }

    private async resultRespondsImagePath(): Promise<ProductsPhoto[]> {
        return await this.productRepository.respondsImagePath(this.productId);
    }

    private async resultProductCard(): Promise<ProductsDescription[]> {
        return await this.productRepository.respondsProductCard(this.productId);
    }

    async writingMessageToPhoto(): Promise<ArrayPhotos[]> {
        let result = await this.resultProductCard();
        let messageToPhoto: string = `"${result[0].product_name}"
Описание: ${result[0].product_description}
Стоимость: ${result[0].price} Р`;

        return (await this.resultRespondsImagePath()).map((item, index) => {
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