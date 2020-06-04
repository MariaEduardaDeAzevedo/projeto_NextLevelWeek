import knex from 'knex';
import path from 'path';

/**
 * Arquivo de conexão com o banco de dados
 */

const connection = knex({
    client: 'sqlite3', //Usando banco de dados sqlite3
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'), //indicando onde está o arquivo do BD
    },
    useNullAsDefault: true,
});

export default connection;
