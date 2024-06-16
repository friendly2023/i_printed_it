import { DatabaseConnection, DatabaseRepository } from '../DB/query'

interface IUpdateProductRepository {
    newProduct(id: string, name: string, price: number): Promise<string>;
    newCategory(categoryL: string, category: string): Promise<string>;
    newDescription(id: string, description: string): Promise<string>;
    newPhoto(newPhotoData: string[][]): Promise<string>;

    updateProduct(id: string, name: string, price: number): Promise<string>;
    updateDescription(id: string, description: string): Promise<string>;
    updatePhoto(newPhotoData: string[][]): Promise<string>;

    checkingAccess(id: string): Promise<string>;
}

class UpdateProductRepository implements IUpdateProductRepository {
    private databaseRepository: DatabaseRepository;

    constructor(databaseRepository: DatabaseRepository) {
        this.databaseRepository = databaseRepository;
    }

    async newProduct(id: string, name: string, price: number): Promise<string> {
        const checkingQuery: string = `SELECT CASE WHEN EXISTS (
        SELECT * FROM products WHERE product_id='${id}')
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT)
        END;`

        const recordingQuery: string = `INSERT INTO products (product_id, product_name, price)
        VALUES ('${id}', '${name}', '${price}');`;

        if (await this.checkingData(checkingQuery) == 1) {
            return `-Продукт с ID = '${id}' уже существует`;
        } else {
            await this.databaseRepository.executeQuery(recordingQuery);
        }

        if (await this.checkingData(checkingQuery) == 1) {
            return `+Продукт с ID = '${id}' добавлен`;
        } else {
            return '?Проблема с добавлением продукта';
        }
    }

    async newCategory(categoryL: string, category: string): Promise<string> {
        const checkingQuery: string = `SELECT CASE WHEN EXISTS (
        SELECT * FROM categories WHERE category_name='${category}')
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT)
        END;`;

        const recordingQuery: string = `INSERT INTO categories (category_name_left, category_name)
        VALUES ('${categoryL}', '${category}');`;

        if (await this.checkingData(checkingQuery) == 1) {
            return `-Категория '${category}' уже существует`;
        } else {
            await this.databaseRepository.executeQuery(recordingQuery);
        }

        if (await this.checkingData(checkingQuery) == 1) {
            return `+Категория '${category}' добавлена`;
        } else {
            return '?Проблема с добавлением категории';
        }
    }

    async newDescription(id: string, description: string): Promise<string> {
        const checkingQuery: string = `SELECT CASE WHEN EXISTS (
        SELECT * FROM productsDescription WHERE product_id='${id}')
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT)
        END;`;

        const recordingQuery: string = `INSERT INTO categories (product_id, product_description)
            VALUES ('${id}', '${description}');`;

        if (await this.checkingData(checkingQuery) == 1) {
            return `-Описание для продукта с ID = '${id}' уже существует`;
        } else {
            await this.databaseRepository.executeQuery(recordingQuery);
        }

        if (await this.checkingData(checkingQuery) == 1) {
            return `+Описание для продукта с ID = '${id}' добавлено`;
        } else {
            return '?Проблема с добавлением описания для продукта';
        }
    }

    async newPhoto(newPhotoData: string[][]): Promise<string> {
        let productId: string = newPhotoData[0][0];

        const checkingQuery: string = `SELECT CASE WHEN EXISTS (
        SELECT * FROM productsPhoto WHERE product_id='${productId}')
        THEN CAST(1 AS BIT)
        ELSE CAST(0 AS BIT)
        END;`;

        const recordingQuery: string = `INSERT INTO productsPhoto (product_id, image_path, order_number)
        VALUES ${newPhotoData.map(([id, path, number]) => `('${id}', '${path}', '${number}')`).join(', ')}`;

        if (await this.checkingData(checkingQuery) == 1) {
            return `-Фото для продукта с ID = '${productId}' уже добавлены`;
        } else {
            await this.databaseRepository.executeQuery(recordingQuery);
        }

        if (await this.checkingData(checkingQuery) == 1) {
            return `+Фото для продукта с ID = '${productId}' добавлены`;
        } else {
            return '?Проблема с добавлением фото для продукта';
        }
    }

    async updateProduct(id: string, name: string, price: number): Promise<string> {
        const updateQuery: string = `UPDATE products
        SET product_name='${name}', price='${price}'
        where product_id='${id}';`;

        await this.databaseRepository.executeQuery(updateQuery);

        return `+Данные продукта с ID = '${id}' обновлены`;
    }

    async updateDescription(id: string, description: string): Promise<string> {
        const updateQuery: string = `UPDATE productsPhoto
        SET product_description='${description}'
        where product_id='${id}';`;

        await this.databaseRepository.executeQuery(updateQuery);

        return `+Описание для продукта с ID = '${id}' обновлено`;
    }

    async updatePhoto(newPhotoData: string[][]): Promise<string> {
        let productId: string = newPhotoData[0][0];

        const updateQuery: string = `UPDATE productsDescription
        SET ${newPhotoData.map(([id, path, number]) => `('${id}', '${path}', '${number}')`).join(', ')}
        where product_id='${productId}';`;

        await this.databaseRepository.executeQuery(updateQuery);

        return `+Фото для продукта с ID = '${productId}' обновлены`;
    }

    async checkingAccess(id: string): Promise<string> {
        let checkDescription: string = `SELECT *
                                        FROM productsDescription
                                        WHERE product_id = '${id}';`;

        let checkPhoto: string = `SELECT * 
                                FROM productsPhoto 
                                WHERE product_id = '${id}';`;

        let checkProducts: string = `SELECT * 
                                    FROM products 
                                    WHERE product_id = '${id}';`;

        let checkCategorieId: string = `SELECT * 
                                        FROM categorieId 
                                        WHERE product_id = '${id}';`;

        let productsAccess: string = `UPDATE products
                                    SET access='yes'
                                    WHERE product_id='${id}';`;

        if ((await this.databaseRepository.executeQuery(checkDescription)).rows.length != 0 &&
            (await this.databaseRepository.executeQuery(checkPhoto)).rows.length != 0 &&
            (await this.databaseRepository.executeQuery(checkProducts)).rows.length != 0 &&
            (await this.databaseRepository.executeQuery(checkCategorieId)).rows.length != 0) {
            await this.databaseRepository.executeQuery(productsAccess)
            return `Товар с ID:${id} доступен для продажи`
        } else {
            return `Товар с ID:${id} НЕ доступен для продажи`
        }
    }

    private async checkingData(query: string): Promise<number> {
        return (await this.databaseRepository.executeQuery(query)).rows[0].case;
    }
}


//для проверки
checkingRequests()
async function checkingRequests() {
    const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
    const queryExecutor = new UpdateProductRepository(databaseRepository);

    let categoryL='Аниме';
    let category='ДжоДжо';

    let productId = '0113';
    let productName = 'какое-то имя';
    let productPrice = 1000;

    let description = 'какое-то описание'

    let newPhotoData: string[][] = [['0107', 'https://disk.yandex.ru/i/7KGO2i0cHtc51A', '1'],
                                    ['0107', 'https://disk.yandex.ru/i/I4jEtZODkTtdow', '2'],
                                    ['0107', 'https://disk.yandex.ru/i/GZBep_eC3zMYrA', '3']];

    // console.log(await queryExecutor.newCategory(categoryL, category));
    // console.log(await queryExecutor.newProduct(productId, productName, productPrice));
    // console.log(await queryExecutor.newDescription(productId, description));
    // console.log(await queryExecutor.newPhoto(newPhotoData));

    // console.log(await queryExecutor.updateProduct(productId, productName, productPrice));
    // console.log(await queryExecutor.updateDescription(productId, description));
    // console.log(await queryExecutor.updatePhoto(newPhotoData));
    // console.log(await queryExecutor.checkingAccess(productId));
}




