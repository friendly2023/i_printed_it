import pg from 'pg';
import { config } from '../serviceKey/dbKey';

// (async () => console.log(await executeQuery('SELECT * FROM users')))()

export class QueryExecutor {
    private client: pg.Client;
    private query: string;

    constructor(query: string) {
        this.client = new pg.Client(config);
        this.query = query;
    }

    async executeQuery(): Promise<pg.QueryResult> {
        try {
            await this.client.connect();// Установка соединения с базой данных
            const result = await this.client.query(this.query);// Выполнение запроса
            await this.client.end();// Закрытие соединения с базой данных
            return result;// Возвращаем результат запроса
        } catch (err: any) {
            console.error('Ошибка при выполнении запроса:', err.message);
            await this.client.end();// В случае ошибки также закрываем соединение с базой данных
            throw err;// Пробрасываем ошибку дальше
        }
    }
}