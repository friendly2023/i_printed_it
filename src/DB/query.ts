import pg from 'pg';
import { config } from '../serviceKey/dbKey';

const client = new pg.Client(config);

export class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor() {
    }

    public static async getInstance(): Promise<DatabaseConnection> {
        if (!DatabaseConnection.instance) {
            await client.connect();
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    async executeQuery(query: string): Promise<pg.QueryResult> {
        try {
            const result = await client.query(query);
            return result;
        } catch (err: any) {
            console.error('Ошибка при выполнении запроса:', err.message);
            await client.end();
            throw err;
        }
    }
}