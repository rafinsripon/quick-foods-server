const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
       return res.status(401).send({message: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
           return res.status(403).send({message: 'Forbidden access'})
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try{
        const serviceCollection = client.db('quickFood').collection('services');
        const reviewsCollection = client.db('quickFood').collection('reviews');

        //JWT token
        app.post('/jwt', (req, res) => {
            const user = req.body;
            // console.log('jwt user:', user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
            res.send({token})
        })




        //get 3 services
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

        app.post('/services', async(req, res) => {
            // console.log(req.body);
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })



        //get one services
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });



        //reviews api get
        app.get('/reviews',verifyJWT, async(req, res) => {
            const decoded = req.decoded;
            // console.log('inside review api decoded', decoded);
            if(decoded.email !== req.query.email){
                res.status(403).send({message: 'unauthorized access'})
            }

            let query = {};
            if(req.query.email){
                query = {  
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query).sort({time: -1});
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        //reviews post api
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        //update reviews api
        app.get('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const user = await reviewsCollection.findOne(query)
            res.send(user)
        })
        
        app.put('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)}
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set:{
                    message: user.message
                }
            }
            const result = await reviewsCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })


        //reviews delete
        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewsCollection.deleteOne(query)
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




