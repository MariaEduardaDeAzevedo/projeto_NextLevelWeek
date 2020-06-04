import path from 'path';

module.exports = {
    client: 'sqlite3', //Usando banco de dados sqlite3
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'), //indicando onde está o arquivo do BD
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault: true,
};
