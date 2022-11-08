const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const serviceCollection = client.db('quickFood').collection('services');
        const reviewsCollection = client.db('quickFood').collection('reviews');

        //get all services
        app.get('/service', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        //get all services
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services)
        })

        //get one services
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //reviews api get
        app.get('/reviews', async(req, res) => {
            console.log(req.query.email);

            let query = {};
            if(req.query.email){
                query = {  
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        //reviews post api
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })
        

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




