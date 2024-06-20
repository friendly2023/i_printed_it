import {
    ProductsPhoto,
    ProductsDescription1,
    ProductRepository,
    FeedbackRating,
    Description,
    ProductName,
} from '../DB/requestsToDB';

class ArrayPhotos {
    type!: string;
    caption?: string;
    media!: string;
}

export interface FigurineCardRepository {
    writingMessageToPhoto(productId: string): Promise<ArrayPhotos[]>;
    writingMessageWithDescription(productId: string): Promise<string>;
}

export class FigurineCard implements FigurineCardRepository {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    private async resultRespondsImagePath(productId: string): Promise<ProductsPhoto[]> {
        return await this.productRepository.respondsImagePath(productId);
    }

    private async resultFeedbackRating(productId: string): Promise<string> {
        let result: FeedbackRating[] = await this.productRepository.respondsFeedbackRating(productId);

        if (result.length == 0) {
            return '0 / 0'
        } else {
            let averageRating: number = result.reduce((sum, item) => sum + item.rating, 0) / result.length;
            return `${averageRating} / 5`
        }
    }

    async writingMessageToPhoto(productId: string): Promise<ArrayPhotos[]> {
        let card1: ProductsDescription1[] = await this.productRepository.respondsProductCard1(productId);
        let rating = await this.resultFeedbackRating(productId);
        let qwerrt = await this.resultRespondsImagePath(productId);

        let messageToPhoto: string = `'${card1[0].product_name}'

⭐️ ${rating}

💰 ${card1[0].price}`;

        return qwerrt.map((item, index) => {
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

    async writingMessageWithDescription(productId: string): Promise<string> {
        let description: Description[] = await this.productRepository.respondsDescription(productId);
        let productName: ProductName[] = await this.productRepository.respondsProductName(productId);

        let message: string = `'${productName[0].product_name}'
➡️ Описание:
${description[0].product_description}`;

        return message;
    }
}