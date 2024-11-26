const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


// sanjitkumarghosh0     cN1b7rS4zaD8R5qi


const uri = "mongodb+srv://sanjitkumarghosh0:cN1b7rS4zaD8R5qi@cluster0.rwhf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // const database = client.db("userDB");
        // const userCollection = database.collection("users");

        const userCollection = client.db('userDB').collection('users')

        app.get('/users', async(req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id', async(req, res) => {
            const id = req.params.id;
            const quary = {_id: new ObjectId(id)};
            const user = await userCollection.findOne(quary);
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log('new user', user);

            // const result = await userCollection.insertOne(user);
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(user);
            const filter = {_id: new ObjectId(id)}
            const option = {upsert: true}
            const updatedUser = {
                $set: {
                    name:user.name,
                    email:user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);

            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('SIMPLE CURD IS RUNING...')
})

app.listen(port, () => {
    console.log(`Simple curd is runing on port ${port}`);
})