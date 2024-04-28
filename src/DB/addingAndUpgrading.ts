import { executeQuery } from './query'

//категории
let categoryAdding: string = `INSERT INTO categories (category_name_left, category_name)
                              VALUES ('Аниме', 'ДжоДжо'),
                                     ('Другое', 'Холодное оружие'),
                                     ('Другое', 'Женщины'),
                                     ('Игры', 'Киберпанк2077'),
                                     ('Игры', 'Скайрим');`;
let categoryUpgrading: string = `UPDATE categories
                                 SET category_name_left=''
                                 WHERE category_name_left='';`
// executeQuery(categoryAdding);

