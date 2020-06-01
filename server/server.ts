import express from 'express';

const app = express();

//Abrindo rota /users
//request == obtem dados da requisição
//response == devolve dados
app.get("/users", (request, response) => {
    console.log("Hello, World!");
    response.json([
        'Maria',
        'Eduarda',
    ]);
});

//Porta do localhost
app.listen(3333);
