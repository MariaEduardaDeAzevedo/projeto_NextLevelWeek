import Knex from 'knex';

//Cria a tabela
exports.up = function(knex: Knex) {
    return knex.schema.createTable("point_items", table => {
        table.increments('id').primary();
        table.integer('point_id').notNullable().references('id').inTable('points');
        table.integer('item_id').notNullable().references('id').inTable('items');
    });
};

//Deleta a tabela
exports.down = function (knex: Knex){
    return knex.schema.dropTable('point_items');
};
