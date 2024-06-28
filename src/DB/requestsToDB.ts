import { DatabaseConnection, DatabaseRepository } from './query'

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

export class ProductsDescription1 {
    product_name!: string;
    price!: number;
}

export class ProductsDescription2 {
    category_name!: string;
    category_name_left!: string;
}

export class FeedbackRating {
    rating!: number;
}

export class Description {
    product_description!: string;
}

export class ProductName {
    product_name!: string;
}

class OldFeedback {
    rating!: number;
}

class QuantityProduct {
    sum!: number;
}

export interface ProductRepository {
    respondsToMenuListProductNameId(): Promise<Product[]>;
    respondsToMenuListCategoryNameLeft(): Promise<CategoriesLeft[]>;
    respondsToMenuListByCategory(categoryNameLeft: string): Promise<ProductsCatalog[]>;
    respondsToMenuListCategoryName(categoryNameLeft: string): Promise<CategoryName[]>;
    respondsToMenuListProductNameIdSubcategory(categoryName: string): Promise<Product[]>;
    respondsImagePath(productId: string): Promise<ProductsPhoto[]>;
    respondsProductCard1(productId: string): Promise<ProductsDescription1[]>;
    respondsProductCard2(productId: string): Promise<ProductsDescription2[]>;
    respondsFeedbackRating(productId: string): Promise<FeedbackRating[]>;
    respondsDescription(productId: string): Promise<Description[]>;
    respondsProductName(productId: string): Promise<ProductName[]>;
    respondsOldFeedback(productId: string, userId: string): Promise<OldFeedback[]>;
    recordNewFeedback(productId: string, userId: string, newRating: number): Promise<void>;
    recordInShoppingCart(productId: string, userId: string): Promise<void>;
    respondsQuantityProduct(productId: string, userId: string): Promise<QuantityProduct[]>;
}

export class RequestsToDB implements ProductRepository {
    private databaseRepository: DatabaseRepository;

    constructor(databaseRepository: DatabaseRepository) {
        this.databaseRepository = databaseRepository;
    }

    async respondsToMenuListProductNameId(): Promise<Product[]> {
        const query: string = `SELECT product_name, product_id
                                FROM products
                                WHERE access = 'yes'
                                ORDER BY product_name;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsToMenuListCategoryNameLeft(): Promise<CategoriesLeft[]> {
        let query: string = `SELECT DISTINCT categories.category_name_left
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes'
                            ORDER BY categories.category_name_left;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsToMenuListByCategory(categoryNameLeft: string): Promise<ProductsCatalog[]> {
        let query: string = `SELECT DISTINCT products.product_id, products.product_name, categories.category_name_left, categorieId.category_name
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                            ORDER BY products.product_name;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsToMenuListCategoryName(categoryNameLeft: string): Promise<CategoryName[]> {
        let query: string = `SELECT DISTINCT categories.category_name
                            FROM categories
                            INNER JOIN categorieId ON categories.category_name=categorieId.category_name
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE products.access='yes' AND categories.category_name_left='${categoryNameLeft}'
                            ORDER BY categories.category_name;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsToMenuListProductNameIdSubcategory(categoryName: string): Promise<Product[]> {
        let query: string = `SELECT products.product_id, products.product_name
                            FROM categorieId
                            INNER JOIN products ON categorieId.product_id=products.product_id
                            WHERE categorieId.category_name='${categoryName}' AND products.access='yes'
                            ORDER BY product_name;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsImagePath(productId: string): Promise<ProductsPhoto[]> {
        let query: string = `SELECT productsPhoto.image_path
                            FROM productsPhoto
                            INNER JOIN products ON productsPhoto.product_id=products.product_id
                            WHERE products.access='yes' and productsPhoto.product_id='${productId}'
                            ORDER BY productsPhoto.order_number;`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsProductCard1(productId: string): Promise<ProductsDescription1[]> {
        let query: string = `SELECT product_name, price
                            FROM products
                            WHERE access='yes' and product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsProductCard2(productId: string): Promise<ProductsDescription2[]> {
        let query: string = `SELECT categories.category_name_left, categorieId.category_name
                            FROM categorieId
                            INNER JOIN categories ON categorieId.category_name=categories.category_name
                            WHERE categorieId.product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsFeedbackRating(productId: string): Promise<FeedbackRating[]> {
        let query: string = `SELECT rating
                            FROM feedback
                            WHERE product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsDescription(productId: string): Promise<Description[]> {
        let query: string = `SELECT product_description
                                FROM productsDescription
                                WHERE product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsProductName(productId: string): Promise<ProductName[]> {
        let query: string = `SELECT product_name
                            FROM products
                            WHERE product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async respondsOldFeedback(productId: string, userId: string): Promise<OldFeedback[]> {
        let query: string = `SELECT rating
                            FROM feedback
                            WHERE user_id='${userId}' AND product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }

    async recordNewFeedback(productId: string, userId: string, newRating: number): Promise<void> {
        let requestVerification: string = `SELECT * FROM feedback
                                            WHERE user_id = '${userId}' AND product_id = '${productId}';`;

        let requestRecord: string = `INSERT INTO feedback (product_id, user_id, rating)
                                    VALUES ('${productId}', '${userId}', '${newRating}');`;

        let requestUpdate: string = `UPDATE feedback
                                    SET rating = '${newRating}'
                                    WHERE user_id = '${userId}' AND product_id = '${productId}';`;

        let reqVerification = await this.databaseRepository.executeQuery(requestVerification)

        if (reqVerification.rows.length == 0) {
            await this.databaseRepository.executeQuery(requestRecord)
        } else {
            await this.databaseRepository.executeQuery(requestUpdate)
        }
    }

    async recordInShoppingCart(productId: string, userId: string): Promise<void> {
        let requestVerification: string = `SELECT * FROM shoppingCart
                                           WHERE user_id = '${userId}' AND product_id = '${productId}';`;

        let requestRecord: string = `INSERT INTO shoppingCart (user_id, product_id, sum)
                                     VALUES ('${userId}','${productId}', 1);`;

        let requestUpdate: string = `UPDATE shoppingCart
                                     SET sum = sum + 1
                                     WHERE user_id = '${userId}' AND product_id = '${productId}';`;

        let reqVerification = await this.databaseRepository.executeQuery(requestVerification)

        if (reqVerification.rows.length == 0) {
            await this.databaseRepository.executeQuery(requestRecord)
        } else {
            await this.databaseRepository.executeQuery(requestUpdate)
        }
    }

    async respondsQuantityProduct(productId: string, userId: string): Promise<QuantityProduct[]> {
        let query: string = `SELECT sum
                            FROM shoppingCart
                            WHERE user_id='${userId}' AND product_id='${productId}';`;

        return (await this.databaseRepository.executeQuery(query)).rows;
    }
}

// checkingRequests()
// async function checkingRequests() {
//     const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
//     const queryExecutor = new RequestsToDB(databaseRepository);

//     console.log(await queryExecutor.recordNewFeedback('0106', '412993464', 5));
// }