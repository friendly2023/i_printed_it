import { executeQuery } from './query'

//категории
// workingСategories ()
function workingСategories(): void {
    let categoryAdding: string = `INSERT INTO categories (category_name_left, category_name)
                                  VALUES ('Аниме', 'ДжоДжо'),
                                         ('Другое', 'Холодное оружие'),
                                         ('Другое', 'Женщины'),
                                         ('Игры', 'Киберпанк2077'),
                                         ('Игры', 'Скайрим');`;
    let categoryUpgrading: string = `UPDATE categories
                                     SET category_name_left=''
                                     WHERE category_name_left='';`;
    // executeQuery(categoryAdding);//добавить
    // executeQuery(categoryUpgrading);//обновить
}

//продукт
// workingProducts()
function workingProducts(): void {
    let productAdding: string = `INSERT INTO products ( product_id,
                                                        product_name, 
                                                        category_name,
                                                        price)
                                  VALUES ('0046',
                                          'Эбонитовый кинжал из игры Скайрим/Skyrim',
                                          'Скайрим',
                                          '1600');`;
    let productUpgrading: string = `UPDATE products
                                    SET category_name='Киберпанк2077'
                                    where product_id='0048'`;
    executeQuery(productAdding);//добавить
    // executeQuery(productUpgrading);//обновить
}

//картинки
// workingPhoto()
function workingPhoto(): void {
    let photoAdding: string = `INSERT INTO productsPhoto ( product_id, image_path, order_number)
    VALUES ('0107','https://disk.yandex.ru/i/7KGO2i0cHtc51A', 1),
            ('0107','https://disk.yandex.ru/i/I4jEtZODkTtdow', 2),
            ('0107','https://disk.yandex.ru/i/GZBep_eC3zMYrA', 3);`;
    // executeQuery(photoAdding);//добавить
}

//обновление доступности
// (async () => console.log(await updatingAccess('0048')))()
async function updatingAccess(id: string) {
    let checkDescription: string = `SELECT *
                                    FROM productsDescription
                                    WHERE product_id = '${id}';`
    let checkPhoto: string = `SELECT * 
                                FROM productsPhoto 
                                WHERE product_id = '${id}';`
    let productsAccess: string = `UPDATE products
                                    SET access='yes'
                                    where product_id='${id}'`
    if ((await executeQuery(checkDescription)).length != 0 && (await executeQuery(checkPhoto)).length != 0) {
        await executeQuery(productsAccess)
        return `Товар с ID:${id} доступен для продажи`
    } else {
        return `Товар с ID:${id} НЕ доступен для продажи`
    }
}
