const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;
// admin11
// R794XJt7bLmV1wMo
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://admin11:R794XJt7bLmV1wMo@cluster0.9xzzr8o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");


        // get api to read all notes
        // http://localhost:4000/notes
        app.get('/notes', async (req, res) => {
            const q = req.query;
            console.log(q);

            const cursor = notesCollection.find(q);
            const result = await cursor.toArray();
            res.send(result);
        });

        // create note
        // http://localhost:4000/note

        /* 
        body {
        "user": "Maria",
        "textData": "Hello Maria"
    }
        */

        app.post('/note', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await notesCollection.insertOne(data);
            res.send(result);
        });

        // update 
        // http://localhost:4000/note/62ef39a3f82fcff5a98cadcd
        app.put('/note/:id', async(req, res)=>{
            const id = req.params.id;

            const data = req.body;
            console.log("from update data", data);
            const filter = { _id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // ...data (spreat operator deyao kora jay )
                    user: data.user, 
                    textData: data.textData,
                },
              };
              const result = await notesCollection.updateOne(filter, updateDoc, options);
            // console.log("from put method",id);
            res.send(result);
        });

        // delete note
        // http://localhost:4000/note/62ef39a3f82fcff5a98cadcd
        app.delete('/note/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = { _id:ObjectId(id)};
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        });


        console.log('connected to db');
    } finally {

    }
}
run().catch(console.dir)


/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object

  console.log('connect');
//   client.close();
}); */




app.get('/', (req, res) => {
    res.send("Hello Note")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})