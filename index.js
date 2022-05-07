const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncmem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://deep:qTvgrz1igsMmhpCW@cluster0.ncmem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const carCollection = client.db("assignment-11").collection("cars")

        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars)
        })

        app.get('/cars/myitems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = carCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            res.send(result);
        });

        app.post('/cars', async (req, res) => {
            const newCars = req.body;
            console.log('adding cars', newCars);
            const result = await carCollection.insertOne(newCars);
            res.send(result)
        });

        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            console.log(updatedUser)
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedUser.quantity,
                },
            }
            const result = await carCollection.updateOne(filter, updatedDoc, option)
            console.log(filter)
            res.send(result)
        });

        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Server running");
});

app.listen(port, () => {
    console.log("server running in", port)
})