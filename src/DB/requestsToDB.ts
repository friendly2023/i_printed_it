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

export async function respondsToMenuListProductNameId(): Promise<SelectResultDB[]> {//
    let productName: string = `SELECT product_name, product_id
                               FROM products
                               ORDER BY product_id;`;

    return executeQuery(productName)
};

export async function respondsToMenuListCategoryNameLeft(): Promise<SelectResultDB[]> {//
    let categoryNameLeft: string = `SELECT DISTINCT category_name_left 
                                    FROM categories
                                    ORDER BY category_name_left;`;

    return executeQuery(categoryNameLeft)
};