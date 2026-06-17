const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.options('*', cors());

server.use(middlewares);
server.use(router);

server.listen(3000, '0.0.0.0', () => {
    console.log('JSON Server is running on http://0.0.0.0:3000');
});