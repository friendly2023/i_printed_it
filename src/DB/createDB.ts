import { DatabaseConnection } from './query'

let creatTableUsers: string = `CREATE TABLE users (
    user_id varchar(20) PRIMARY KEY,
    user_name varchar(33) NOT NULL
);`;

let creatTableProducts: string = `CREATE TABLE products (
    product_id varchar(6) PRIMARY KEY,
    product_name varchar(50) NOT NULL,
    price varchar(13) NOT NULL DEFAULT 'Нет в наличии',
    access varchar(3) NOT NULL DEFAULT 'no'
);`;

let creatTableProductsDescription: string = `CREATE TABLE productsDescription (
    product_id varchar(6) PRIMARY KEY,
    product_description varchar(1000) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);`;

let creatTableProductsPhoto: string = `CREATE TABLE productsPhoto (
    product_id varchar(6) NOT NULL,
    image_path varchar(255) NOT NULL,
    order_number INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);`;

let creatTableCategories: string = `CREATE TABLE categories (
    category_name_left varchar(30),
    category_name varchar(30) PRIMARY KEY    
);`;

let creatTableCategoriesId: string = `CREATE TABLE categorieId (
    product_id varchar(6) PRIMARY KEY,
    category_name varchar(30) NOT NULL,
    FOREIGN KEY (category_name) REFERENCES categories(category_name)   
);`;

let creatTablePurchaseHistory: string = `CREATE TABLE purchaseHistory (
    purchase_id SERIAL PRIMARY KEY,
    user_id varchar(20) NOT NULL,
    shopping_list varchar(500) NOT NULL,
    time_of_purchase TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
//TO_CHAR(time_of_purchase, 'YYYY-MM-DD HH24:MI')//для получения даты без секунд

let creatTableShoppingCart: string = `CREATE TABLE shoppingCart (
    user_id varchar(20) NOT NULL,
    product_id varchar(6) NOT NULL,
    sum varchar(6) NOT NULL
);`;

let creatTableFeedback: string = `CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    product_id varchar(6),
    user_id varchar(20),
    rating SMALLINT CHECK (my_column BETWEEN 1 AND 5),
    response varchar(1000)
);`;


// const queryExecutor = new DatabaseConnection(creatTableUsers);
// queryExecutor.executeQuery()
//     .then((result) => {
//         console.log('Таблица создана');
//     })
//     .catch((err) => {
//         console.error('Error:', err.message);
//     });
