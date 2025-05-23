const express = require("express");
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yj1zgc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const recipeCollection = client.db('recipeDB').collection('recipe')
        const usersCollection = client.db('recipeDB').collection('users')

      
    app.post('/recipe', async (req, res) => {
      const newRecipe = req.body;
      const result = await recipeCollection.insertOne(newRecipe);
      res.send(result);
    });

   
    app.get('/recipe', async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    });


    app.get('/recipe/top', async (req, res) => {
      const result = await recipeCollection.find().sort({ likeCount: -1 }).limit(6).toArray();
      res.send(result);
    });

    
    app.get('/recipe/:id', async (req, res) => {
      const id = req.params.id;
      const result = await recipeCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

  
    app.get('/myrecipe/:email', async (req, res) => {
      const email = req.params.email;
      const result = await recipeCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

   
    app.put('/recipe/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await recipeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

   
    app.delete('/recipe/:id', async (req, res) => {
      const id = req.params.id;
      const result = await recipeCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

  
    app.patch('/like/:id', async (req, res) => {
      const id = req.params.id;
      const result = await recipeCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { likeCount: 1 } }
      );
      res.send(result);
    });

    
    // app.post('/users', async (req, res) => {
    //   const user = req.body;
    //   const result = await usersCollection.insertOne(user);
    //   res.send(result);
    // });


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is working perfectly')
})

app.listen(port, () => {
    console.log('server is running on ', port);
})


