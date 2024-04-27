import { executeQuery } from './query'

let creatTableUsers: string = `CREATE TABLE users (
    user_id varchar(20) PRIMARY KEY,
    user_name varchar(33) NOT NULL
);`;

let creatTableProducts: string = `CREATE TABLE products (
    product_id varchar(6) PRIMARY KEY,
    product_name varchar(50) NOT NULL,
    product_description varchar(1000),
    access varchar(3) NOT NULL DEFAULT 'no',
    price varchar(10) NOT NULL DEFAULT '0'
);`;

let creatTableCategories: string = `CREATE TABLE categories (
    category_name varchar(30) PRIMARY KEY,
    category_name_left varchar(30)
);`;

let creatTableProductsCategories: string =`CREATE TABLE productsCategories (
    product_id varchar(6) PRIMARY KEY,
    category_name varchar(30) NOT NULL
);`;

let creatTablePurchaseHistory: string = `CREATE TABLE purchaseHistory (
    purchase_id id SERIAL PRIMARY KEY,
    user_id varchar(20) NOT NULL,
    shopping_list varchar(500) NOT NULL
);`;

let creatTableShoppingCart: string = `CREATE TABLE shoppingCart (
    user_id varchar(20) NOT NULL,
    product_id varchar(6) NOT NULL,
    sum varchar(6) NOT NULL
);`;

