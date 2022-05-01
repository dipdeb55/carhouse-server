const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// DB_PASSWORD=rkYcBBmeI1fAX03K

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://deep:PhnCF0OuymW8hZxv@cluster0.ncmem.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            res.send(result);
        });

        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const newQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: newQuantity[0].quantity,
                },
            }
            const result = await carCollection.updateOne(filter, updatedDoc, option)
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