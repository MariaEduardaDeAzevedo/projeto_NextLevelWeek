import Knex from 'knex';

//Cria a tabela
exports.up = function(knex: Knex) {
    return knex.schema.createTable("points", table => {
        table.increments('id').primary(); //ID do usuário
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });
};

//Deleta a tabela
exports.down = function(knex: Knex){
    return knex.schema.dropTable('points');
};