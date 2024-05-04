import { ProductsPhoto, ProductsDescription, respondsImagePath, respondsProductCard } from '../DB/requestsToDB';

export let arrayPhotos: ({
    type: string;
    caption: string;
    media: string;
} | {
    type: string;
    media: string;
    caption?: undefined;
})[] = [];

export async function creatingFigurineCard(productId: string): Promise<typeof arrayPhotos> {
    let resultRequest: ProductsPhoto[] = await respondsImagePath(productId);
    let resultBasicInfo: ProductsDescription[] = await respondsProductCard(productId);
    let messageToPhoto: string = `"${resultBasicInfo[0].product_name}"
Описание: ${resultBasicInfo[0].product_description}
Стоимость: ${resultBasicInfo[0].price} Р`;

    return arrayPhotos = resultRequest.map((item, index) => {
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
};

(async () => console.log(await creatingFigurineCard('0046')))()