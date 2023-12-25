const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykjz5lg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const createTaskCollection = client
      .db("createTaskDB")
      .collection("createTask");

    app.get("/createTask", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await createTaskCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/createTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await createTaskCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/createTask/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body; // Retrieve the status from the request body

      try {
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: { status: status }, // Update the status based on the request body
        };

        const result = await createTaskCollection.updateOne(filter, updatedDoc);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error updating task status");
      }
    });

    // app.patch("/createTask/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedDoc = {
    //     $set: {
    //       status: "ongoing",
    //     },
    //   };
    //   const result = await createTaskCollection.updateOne(filter, updatedDoc);
    //   res.send(result);
    // });

    // app.patch("/createTask/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedDoc = {
    //     $set: {
    //       status: "to-do",
    //     },
    //   };
    //   const result = await createTaskCollection.updateOne(filter, updatedDoc);
    //   res.send(result);
    // });

    // app.patch("/createTask/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updatedDoc = {
    //     $set: {
    //       status: "completed",
    //     },
    //   };
    //   const result = await createTaskCollection.updateOne(filter, updatedDoc);
    //   res.send(result);
    // });

    app.post("/createTask", async (req, res) => {
      const createTask = req.body;
      console.log(createTask);
      const result = await createTaskCollection.insertOne(createTask);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("task management server is running");
});

app.listen(port, () => {
  console.log(`task management server is running${port}`);
});
