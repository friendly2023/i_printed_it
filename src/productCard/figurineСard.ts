import { respondsImagePath, respondsProductCard } from '../DB/requestsToDB';

export let arrayPhotos: ({
    type: string;
    caption: string;
    media: string;
} | {
    type: string;
    media: string;
    caption?: undefined;
})[] = [];

// (async () => console.log(await creatingFigurineCard('0107')))()
export async function creatingFigurineCard(productId: string): Promise<typeof arrayPhotos> {
    let resultRequest = await respondsImagePath(productId);
    let resultBasicInfo = await respondsProductCard(productId);
    let messageToPhoto = `"${resultBasicInfo[0].product_name}"
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