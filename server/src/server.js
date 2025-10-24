const http = require('http')

const app = require('./app');

const {mongoConnect} = require('./services/mongo');

const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8001;

const MONGO_URL = process.env.MONGO_URL;

const server = http.createServer(app); 

async function startServer(){
    await mongoConnect();
    await loadPlanetsData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}
startServer();





