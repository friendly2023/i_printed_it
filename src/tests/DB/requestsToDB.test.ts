import { ProductRepository, RequestsToDB } from '../../DB/requestsToDB';
import { DatabaseConnection, DatabaseRepository } from '../../DB/query';

describe('RequestsToDB', () => {
  let databaseRepository: DatabaseRepository;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    databaseRepository = await DatabaseConnection.getInstance();
    productRepository = new RequestsToDB(databaseRepository);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  it('запрос наименования продукта и id', async () => {
    const result = await productRepository.respondsToMenuListProductNameId();
    expect(result).toBeDefined();
  });
});