import {
    RequestsToDB,
    ProductsPhoto,
    ProductsDescription,
} from '../DB/requestsToDB';

class ArrayPhotos {
    type!: string;
    caption?: string;
    media!: string;
}

export class FigurineCard {
    constructor(public productId: string) {
        this.productId = productId;
    }

    private async resultRespondsImagePath(): Promise<ProductsPhoto[]> {
        let requestsToDB = new RequestsToDB();
        return await requestsToDB.respondsImagePath(this.productId);
    }

    private async resultProductCard(): Promise<ProductsDescription[]> {
        let requestsToDB = new RequestsToDB();
        return await requestsToDB.respondsProductCard(this.productId);
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