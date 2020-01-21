const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const http = require('http');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

//conexão com o Mongo
mongoose.connect('mongodb+srv://rgalli:egj516400@cluster0-dfqou.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//app.use(cors({ origin: 'http://localhost:3000' }))
app.use(cors())
app.use(express.json()); //configura a aplicação para receber JSON. precisa vir antes das rotas.
app.use(routes);


//Tipos de parametros
//Query Params: request.query (Filtros, ordenação, paginação ...)
//Route Params: request.params (Identificar um recurso na alteração ou remoção)
//Body: request.body (Dados para crição ou alteração de um registro)

server.listen(3333);