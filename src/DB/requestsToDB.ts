import { DatabaseConnection } from './query'

export class Product {
    product_name!: string;
    product_id!: string;
};

export class CategoriesLeft {
    category_name_left!: string;
};

export class ProductsCatalog {
    product_id!: string;
    product_name!: string;
    category_name_left!: string;
    category_name!: string;
};

export class CategoryName {
    category_name!: string;
};

export class ProductsPhoto {
    image_path!: string;
};

export class ProductsDescription {
    product_name!: string;
    product_description!: string;
    price!: number;
}

let databaseConnection = DatabaseConnection.getInstance();

export class RequestsToDB {

    async respondsToMenuListProductNameId(): Promise<Product[]> {
        const query: string = `SELECT product_name, product_id
                                FROM products
                                WHERE access = 'yes'
                                ORDER BY product_name;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsToMenuListCategoryNameLeft(): Promise<CategoriesLeft[]> {
        let query: string = `SELECT DISTINCT categories.category_name_left
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes'
                            ORDER BY categories.category_name_left;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsToMenuListByCategory(categoryNameLeft: string): Promise<ProductsCatalog[]> {
        let query: string = `SELECT DISTINCT products.product_id, products.product_name, categories.category_name_left, categorieId.category_name
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                            ORDER BY products.product_name;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsToMenuListCategoryName(categoryNameLeft: string): Promise<CategoryName[]> {
        let query: string = `SELECT DISTINCT categories.category_name
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                            ORDER BY categories.category_name;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsToMenuListProductNameIdSubcategory(categoryName: string): Promise<Product[]> {
        let query: string = `SELECT products.product_id, products.product_name
                            FROM categorieId
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE categorieId.category_name='${categoryName}' AND products.access='yes'
                            ORDER BY product_name;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsImagePath(productId: string): Promise<ProductsPhoto[]> {
        let query: string = `SELECT productsPhoto.image_path
                            FROM productsPhoto
                            INNER JOIN products ON productsPhoto.product_id=products.product_id
                            WHERE products.access='yes' and productsPhoto.product_id='${productId}'
                            ORDER BY productsPhoto.order_number;`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }

    async respondsProductCard(productId: string): Promise<ProductsDescription[]> {
        let query: string = `SELECT products.product_name, productsDescription.product_description, products.price
                            FROM products
                            INNER JOIN productsDescription ON products.product_id=productsDescription.product_id
                            WHERE products.access='yes' and products.product_id='${productId}';`;

        return (await (await databaseConnection).executeQuery(query)).rows;
    }
}