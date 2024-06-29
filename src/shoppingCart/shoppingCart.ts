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

    async displayShoppingCart(userId: string): Promise<any> {
        let dataFromDB: DataShoppingCart[] = await this.productRepository.respondsShoppingCart(userId);
        let totalSum: number = dataFromDB.reduce((acc, item) => acc + item.sum, 0);
        let totalPrice: number = dataFromDB.reduce((acc, item) => acc + Number(item.price), 0);

        const list = dataFromDB.map((item, index) => {
            return `${index + 1}. '${item.product_name}' - ${item.sum} шт.`;
        }).join('\n');

        let message = `${list}
        
    Итого: ${totalSum} шт.
    Общая сумма: ${totalPrice} Р`;

        return message;
    }
}

// checkingRequests()
// async function checkingRequests() {
//     const databaseRepository: DatabaseRepository = await DatabaseConnection.getInstance();
//     const queryExecutor: ProductRepository = new RequestsToDB(databaseRepository);
//     const shoppingCart: IShoppingCart = new ShoppingCart(queryExecutor);

//     console.log(await shoppingCart.displayShoppingCart('412993464'));
// }