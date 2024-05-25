import pg from 'pg';
import { config } from '../serviceKey/dbKey';

const client = new pg.Client(config);

export class DatabaseConnection {
    private static instance: DatabaseConnection;

    private constructor(public query: string) {
        this.query = query;
    }

    public static getInstance(query: string): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection(query);
        }
        return DatabaseConnection.instance;
    }

    async executeQuery(): Promise<pg.QueryResult> {
        try {
            await client.connect();
            const result = await client.query(this.query);
            await client.end();
            return result;
        } catch (err: any) {
            console.error('Ошибка при выполнении запроса:', err.message);
            await client.end();
            throw err;
        }
    }
}