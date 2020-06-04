import Knex from 'knex';

//Cria a tabela
exports.up = function(knex: Knex) {
    return knex.schema.createTable("items", table => {
        table.increments('id').primary(); //ID do item
        table.string('title').notNullable();
        table.string('image').notNullable();
    });
};

//Deleta a tabela
exports.down =  function(knex: Knex) {
    return knex.schema.dropTable('items');
};
