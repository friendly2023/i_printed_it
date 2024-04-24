import pg from 'pg'
import {config} from '../serviceKey/dbKey'

(async () => console.log(await executeQuery('SELECT * FROM users')))()

async function executeQuery(query:string) {
    const client = new pg.Client(config);

    try {
        await client.connect(); // Установка соединения с базой данных
        const result = await client.query(query); // Выполнение запроса
        await client.end();// Закрытие соединения с базой данных
        return result.rows; // Возвращаем результат запроса
    } catch (err:any) {
        console.error('Error executing query:', err.message);
        await client.end(); // В случае ошибки также закрываем соединение с базой данных
        throw err; // Пробрасываем ошибку дальше
    }
}