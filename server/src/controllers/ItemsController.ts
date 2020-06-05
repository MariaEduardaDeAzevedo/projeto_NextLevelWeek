import knex from '../database/connection'
import {Request, Response} from 'express'

class ItemsController {

    //Lista itens
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*'); //Pegando todos os items do banco de dados
    
        //Formatando o retorno de cada item
        const serializedItems = items.map(item => {
            return { 
                title: item.title,
                image_url: `http://192.168.1.10:3333/uploads/${item.image}`,
                id: item.id,    
            };
        });

        return response.json(serializedItems);
    }
}

export default ItemsController;
