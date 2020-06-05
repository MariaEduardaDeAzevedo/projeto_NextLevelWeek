import express, { response } from 'express';
import cors from 'cors';
import routes from './routes'; //Importando as rotas da minha aplicação
import path from 'path'
import { errors } from 'celebrate'

/**
 * Arquivo de configuração do servidor
 */

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(routes);
app.use("/uploads", express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(errors());

//Porta aberta do localhost
app.listen(3333);
