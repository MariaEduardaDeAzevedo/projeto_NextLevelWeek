import express, { request, response } from 'express'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

/**
 * Arquivo que sinaliza as rotas da aplicação
 */

/**
 * ROTAS:
 * 1. Cadastrar ponto
 * 2. Listar items 
 * 3. Listar pontos (filtro estado/cidade/item)
 * 4. Buscar ponto de coleta
 */
const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

//Cria novo point
routes.post('/points', pointsController.create);

//Buscar point
routes.get('/points/:id', pointsController.show);

//Listar points com filtros
routes.get('/points', pointsController.index)

//Lista itens
routes.get('/items', itemsController.index);

export default routes;
