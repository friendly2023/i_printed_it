"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
//категории
// workingСategories ()
function workingСategories() {
    let categoryAdding = `INSERT INTO categories (category_name_left, category_name)
                                  VALUES ('Аниме', 'ДжоДжо'),
                                         ('Другое', 'Холодное оружие'),
                                         ('Другое', 'Женщины'),
                                         ('Игры', 'Киберпанк2077'),
                                         ('Игры', 'Скайрим');`;
    let categoryUpgrading = `UPDATE categories
                                     SET category_name_left=''
                                     WHERE category_name_left='';`;
    // executeQuery(categoryAdding);//добавить
    // executeQuery(categoryUpgrading);//обновить
}
//продукт
// workingProducts()
function workingProducts() {
    let productDescription = `острый режие`;
    let productAdding = `INSERT INTO products ( product_id,
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
    let productUpgrading = `UPDATE products
                                    SET category_name='Киберпанк2077'
                                    where product_id='0048'
                                    `;
    (0, query_1.executeQuery)(productAdding); //добавить
    // executeQuery(productUpgrading);//обновить
}
