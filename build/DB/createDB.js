"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let creatTableUsers = `CREATE TABLE users (
    user_id varchar(20) PRIMARY KEY,
    user_name varchar(33) NOT NULL
);`;
let creatTableProducts = `CREATE TABLE products (
    product_id varchar(6) PRIMARY KEY,
    product_name varchar(50) NOT NULL,
    product_description varchar(1000) NOT NULL DEFAULT '*Описание отсутствует*',
    category_name varchar(30) NOT NULL,
    price varchar(13) NOT NULL DEFAULT 'Нет в наличии',
    access varchar(3) NOT NULL DEFAULT 'no'
);`;
let creatTableCategories = `CREATE TABLE categories (
    category_name_left varchar(30),
    category_name varchar(30) PRIMARY KEY    
);`;
let creatTablePurchaseHistory = `CREATE TABLE purchaseHistory (
    purchase_id SERIAL PRIMARY KEY,
    user_id varchar(20) NOT NULL,
    shopping_list varchar(500) NOT NULL,
    time_of_purchase TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
//TO_CHAR(time_of_purchase, 'YYYY-MM-DD HH24:MI')//для получения даты без секунд
let creatTableShoppingCart = `CREATE TABLE shoppingCart (
    user_id varchar(20) NOT NULL,
    product_id varchar(6) NOT NULL,
    sum varchar(6) NOT NULL
);`;
//функции создания таблиц
// executeQuery(creatTableUsers);
// executeQuery(creatTableProducts);
// executeQuery(creatTableCategories);
// executeQuery(creatTablePurchaseHistory);
// executeQuery(creatTableShoppingCart);
