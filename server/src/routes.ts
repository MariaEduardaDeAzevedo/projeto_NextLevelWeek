import express, { request, response } from 'express'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'
import multer from 'multer';
import multerConfig from './config/multer'
import { celebrate, Joi } from 'celebrate'

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
const upload = multer(multerConfig);

//Cria novo point
routes.post('/points', 
upload.single('image'), 
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string(),
    })}, 
    {
        abortEarly: false
    }
    ),
    pointsController.create
);

//Buscar point
routes.get('/points/:id', pointsController.show);

//Listar points com filtros
routes.get('/points', pointsController.index)

//Lista itens
routes.get('/items', itemsController.index);

export default routes;
