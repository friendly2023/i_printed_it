import { DatabaseRepository, DatabaseConnection } from "../DB/query";
import { DataShoppingCart, ProductName, ProductRepository, RequestsToDB } from "../DB/requestsToDB";

export interface IShoppingCart {
    displayShoppingCart(userId: string): Promise<string>;
}

export class ShoppingCart implements IShoppingCart {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    async displayShoppingCart(userId: string): Promise<string> {
        let cart = this.dataShoppingCart(userId);
        const formattedCart = (await cart).map((item, index) => {
            return `${index + 1}. '${item.product_name}' - ${item.sum} шт.`;
        }).join('\n');
        return formattedCart;
    }

    private async dataShoppingCart(userId: string): Promise<DataShoppingCart[]> {
        let dataFromDB: DataShoppingCart[] = await this.productRepository.respondsShoppingCart(userId);
        let nameProducts: string[] = [];

        for (let i = 0; i < dataFromDB.length; i++) {
            let nameProduct: ProductName[] = await this.productRepository.respondsProductName(dataFromDB[i].product_id);
            nameProducts.push(nameProduct[0].product_name);
            dataFromDB[i].product_name = nameProducts[i];
        }
        return dataFromDB;
    }
}

// checkingRequests()
// async function checkingRequests() {
//     const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
//     const queryExecutor: ProductRepository = new RequestsToDB(databaseRepository);
//     const shoppingCart: IShoppingCart = new ShoppingCart(queryExecutor);

//     console.log(await shoppingCart.displayShoppingCart('412993464'));
// }