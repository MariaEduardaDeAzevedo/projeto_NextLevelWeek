import knex from '../database/connection';
import {Request, Response} from 'express';

class PointsController {

    //Cria novo point
    async create(request: Request, response: Response) {
        
        const trx = await knex.transaction();

        //Pegando os valores da entrada
        const {
            name, 
            email, 
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;

        //Colocando valores na tabela do BD
        const point = await trx('points').insert({
            image: request.file.filename,
            name, 
            email, 
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        });

        const point_id = point[0];

        const pointItems = items
        .split(',').map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return {
                item_id,
                point_id
            };
        })

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({ 
            id: point_id,
            ...point,
        });   
    }

    async show(request: Request, response: Response) {
        const id = request.params.id; //Pegando o ID de um point
        
        //Procurando o point com o ID passado
        const point = await knex('points').where('id', id).first();
        
        if (!point) { //Retorna um erro caso não exista
            return response.status(400).json({ message: 'point não existente'}); 
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.1.10:3333/uploads/${point.image}`,
        };

        //Items relacionados ao ponto encontrado
        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id).select('items.title');

        return response.json({ point:serializedPoint, items });
    }

    async index(request: Request, response: Response) {
        //Pegando os filtros
        const { city, uf, items } = request.query;

        //Separando filtros de items em itens de um array
        const itemsArray = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        //Filtrando os points
        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id') //juntando dados das tabelas
        .whereIn('point_items.item_id', itemsArray) //Onde os IDs dos itens condizem com o filtro
        .where('city', String(city)) //Onde a cidade condiz com o filtro
        .where('uf', String(uf)) //Onde a UF condiz com o filtro
        .distinct() // Apenas quando for distinto
        .select('points.*') //Procurando em todos os elementos da tabela points

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.1.10:3333/uploads/${point.image}`
            };
        });

        return response.json(serializedPoints)
    }
}

export default PointsController;
