import { executeQuery } from './query'

export class SelectResultDB {
    product_id!: string;
    product_name!: string;
    product_description!: string;
    category_name!: string;
    price!: number;
    access!: string;
    category_name_left!: string;
}

export async function respondsToMenuListProductNameId(): Promise<SelectResultDB[]> {
    let productName: string = `SELECT product_name, product_id
                               FROM products
                               WHERE access='yes'
                               ORDER BY product_id;`;

    return executeQuery(productName)
};

export async function respondsToMenuListCategoryNameLeft(): Promise<SelectResultDB[]> {
    let categoryNameLeft: string = `SELECT DISTINCT categories.category_name_left
                                    FROM categories
                                    INNER JOIN products ON categories.category_name=products.category_name
                                    WHERE access='yes'
                                    ORDER BY categories.category_name_left;`;

    return executeQuery(categoryNameLeft)
};

export async function respondsToMenuListByCategory(categoryNameLeft: string): Promise<SelectResultDB[]> {
    let query: string = `SELECT products.product_id, products.product_name, categories.category_name_left, products.category_name
                         FROM products
                         INNER JOIN categories ON products.category_name=categories.category_name
                         WHERE category_name_left='${categoryNameLeft}' AND access='yes'
                         ORDER BY product_name;`;

    return executeQuery(query)
}

export async function respondsToMenuListCategoryName(categoryNameLeft: string): Promise<SelectResultDB[]> {//эта
    let categoryName: string = `SELECT DISTINCT products.category_name
                                FROM products
                                INNER JOIN categories ON products.category_name=categories.category_name
                                WHERE category_name_left='${categoryNameLeft}' AND access='yes'
                                ORDER BY category_name;`;

    return executeQuery(categoryName)
}

export async function respondsToMenuListProductNameIdSubcategory(categoryName: string): Promise<SelectResultDB[]> {
    let query: string = `SELECT product_id, product_name
                         FROM products
                         WHERE category_name='${categoryName}' AND access='yes'
                         ORDER BY product_name;`;

    return executeQuery(query)
}