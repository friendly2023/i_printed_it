import { DatabaseConnection } from '../../DB/query';

describe('DatabaseConnection', () => {
  let instance: DatabaseConnection;

  beforeEach(async () => {
    instance = await DatabaseConnection.getInstance();
  });

  it('создать единственный экземпляр подключения к БД', async () => {
    let instance1 = await DatabaseConnection.getInstance();
    let instance2 = await DatabaseConnection.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('получениея ответа на отправленный запрос', async () => {
    let query: string = `SELECT * FROM products;`;
    let queryResult = await instance.executeQuery(query);
    expect(queryResult.rows.length).toBeGreaterThan(0);
  });

  it('получениея ошибки', async () => {
    let consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let query: string = `SELECT + FROM products;`;
    await expect(instance.executeQuery(query)).rejects.toThrowError();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});