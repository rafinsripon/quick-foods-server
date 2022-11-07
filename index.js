const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
require('colors');


//medleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0mxdn2v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const serviceCollection = client.db('quickFood').collection('services')
    }
    catch(error){
        console.log(error.name.bgRed, error.message);
    }
}
run();




app.get('/', (req, res) => {
    res.send('Quick food Server Working')
})

app.listen(port, () => {
    console.log(`Quick Server running on port: ${port}`.bgMagenta.bold)
})




