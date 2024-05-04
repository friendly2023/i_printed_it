import { executeQuery } from './query'

export interface Product {
    product_name: string;
    product_id: string;
};

export interface CategoriesLeft {
    category_name_left: string;
};

export interface ProductsCatalog {
    product_id: string,
    product_name: string,
    category_name_left: string,
    category_name: string
};

export interface CategoryName {
    category_name: string
};

export interface ProductsPhoto {
    image_path: string,
};

export interface ProductsDescription {
    product_name: string,
    product_description: string,
    price: number
}

export async function respondsToMenuListProductNameId(): Promise<Product[]> {
    let productName: string = `SELECT product_name, product_id
                               FROM products
                               WHERE access='yes'
                               ORDER BY product_name;`;

    return executeQuery(productName)
};

export async function respondsToMenuListCategoryNameLeft(): Promise<CategoriesLeft[]> {
    let categoryNameLeft: string = `SELECT DISTINCT categories.category_name_left
                                    FROM categories
                                    INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                                    INNER JOIN products ON categorieId.product_id=products.product_id
                                    WHERE products.access='yes'
                                    ORDER BY categories.category_name_left;`;

    return executeQuery(categoryNameLeft)
};

export async function respondsToMenuListByCategory(categoryNameLeft: string): Promise<ProductsCatalog[]> {
    let query: string = `SELECT DISTINCT products.product_id, products.product_name, categories.category_name_left, categorieId.category_name
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                            ORDER BY products.product_name;`;

    return executeQuery(query)
}

export async function respondsToMenuListCategoryName(categoryNameLeft: string): Promise<CategoryName[]> {
    let categoryName: string = `SELECT DISTINCT categories.category_name
                                FROM categories
                                INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                                INNER JOIN products ON categorieId.product_id=products.product_id
                                WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                                ORDER BY categories.category_name;`;

    return executeQuery(categoryName)
}

export async function respondsToMenuListProductNameIdSubcategory(categoryName: string): Promise<Product[]> {
    let query: string = `SELECT products.product_id, products.product_name
                            FROM categorieId
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE categorieId.category_name='${categoryName}' AND products.access='yes'
                            ORDER BY product_name;`;

    return executeQuery(query)
}

export async function respondsImagePath(productId: string): Promise<ProductsPhoto[]> {
    let query: string = `SELECT productsPhoto.image_path
                         FROM productsPhoto
                         INNER JOIN products ON productsPhoto.product_id=products.product_id
                         WHERE products.access='yes' and productsPhoto.product_id='${productId}'
                         ORDER BY productsPhoto.order_number;`;
    return executeQuery(query)
}

export async function respondsProductCard(productId: string): Promise<ProductsDescription[]> {
    let query: string = `SELECT products.product_name, productsDescription.product_description, products.price
                         FROM products
                         INNER JOIN productsDescription ON products.product_id=productsDescription.product_id
                         WHERE products.access='yes' and products.product_id='${productId}';`;
    return executeQuery(query)
}