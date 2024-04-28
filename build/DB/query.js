"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeQuery = void 0;
const pg_1 = __importDefault(require("pg"));
const dbKey_1 = require("../serviceKey/dbKey");
// (async () => console.log(await executeQuery('SELECT * FROM users')))()
function executeQuery(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new pg_1.default.Client(dbKey_1.config);
        try {
            yield client.connect(); // Установка соединения с базой данных
            const result = yield client.query(query); // Выполнение запроса
            yield client.end(); // Закрытие соединения с базой данных
            return result.rows; // Возвращаем результат запроса
        }
        catch (err) {
            console.error('Error executing query:', err.message);
            yield client.end(); // В случае ошибки также закрываем соединение с базой данных
            throw err; // Пробрасываем ошибку дальше
        }
    });
}
exports.executeQuery = executeQuery;
