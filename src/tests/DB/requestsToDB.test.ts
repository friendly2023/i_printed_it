import { Product, ProductRepository, RequestsToDB } from '../../DB/requestsToDB';
import { DatabaseConnection, DatabaseRepository } from '../../DB/query';

class ProductFull {
  product_id!: string;
  product_name!: string;
  price!: string;
  access!: string;
}

class FakeDatabaseRepository implements DatabaseRepository {
  private products: ProductFull[] = [
    { product_id: '1', product_name: 'Product A', price: '1', access: 'yes' },
    { product_id: '2', product_name: 'Product B', price: '1', access: 'yes' },
    { product_id: '3', product_name: 'Product C', price: '1', access: 'no' },
    { product_id: '4', product_name: 'Product D', price: '1', access: 'yes' },
    { product_id: '5', product_name: 'Product E', price: '1', access: 'no' },
  ];

  async executeQuery(query: string): Promise<any> {
    const regex = /SELECT\s+(\w+),\s+(\w+)\s+FROM\s+(\w+)\s+WHERE\s+(\w+)\s*=\s*'(\w+)'/;
    const match = query.match(regex);
  
    if (match) {
      const [, selectField1, selectField2, fromTable, whereField, whereValue] = match;

      if (fromTable !== 'products') {
        throw new Error('Неожиданное имя таблицы: ' + fromTable);
      }

      const filteredProducts = this.products.filter((product) => {
        return product[whereField as keyof ProductFull] === whereValue;
      });
  
      const result = filteredProducts.map((product) => ({
        [selectField1]: product[selectField1 as keyof ProductFull],
        [selectField2]: product[selectField2 as keyof ProductFull],
      }));
  
      return { rows: result, fromTable };
    }
  
    throw new Error('Недопустимый формат запроса');
  } 
}

describe('RequestsToDB', () => {
  let fakeDatabaseRepository: FakeDatabaseRepository;
  let requestsToDBInstance: RequestsToDB;

  beforeEach(() => {
    fakeDatabaseRepository = new FakeDatabaseRepository();
    requestsToDBInstance = new RequestsToDB(fakeDatabaseRepository);
  });

  it('respondsToMenuListProductNameId should return the correct data', async () => {
    const expectedProducts: Product[] = [
      { product_id: '1', product_name: 'Product A'},
      { product_id: '2', product_name: 'Product B'},
      { product_id: '4', product_name: 'Product D'},
    ];

    const result = await requestsToDBInstance.respondsToMenuListProductNameId();
    console.log(result);
    expect(result).toEqual(expectedProducts);
  });
});
