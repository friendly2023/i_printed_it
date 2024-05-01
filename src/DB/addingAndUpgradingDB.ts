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
    let productDescription: string = `острый режие`;
    let productAdding: string = `INSERT INTO products ( product_id,
                                                        product_name, 
                                                        product_description, 
                                                        category_name,
                                                        price,
                                                        access)
                                  VALUES ('0046',
                                          'Эбонитовый кинжал из игры Скайрим/Skyrim',
                                          '${productDescription}',
                                          'Скайрим',
                                          '1600',
                                          'yes');`;
    let productUpgrading: string = `UPDATE products
                                    SET category_name='Киберпанк2077'
                                    where product_id='0048'`;
    executeQuery(productAdding);//добавить
    // executeQuery(productUpgrading);//обновить
}