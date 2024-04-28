import { executeQuery } from './query'

export class SelectResultDB {
    product_id!: string;
    product_name!: string;
    product_description!: string;
    category_name!: string;
    price!: number;
    access!: string;
}

export async function respondsToMenuList(indicator: string): Promise<SelectResultDB[]> {//
    let productName: string = `SELECT product_name
                               FROM products
                               ORDER BY product_id;`;
    let productId: string = `SELECT product_id
                             FROM products
                             ORDER BY product_id;`;

    if (indicator === 'product_name') {
        return executeQuery(productName)
    } else {
        return executeQuery(productId)
    }
};