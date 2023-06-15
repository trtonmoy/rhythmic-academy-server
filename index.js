const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//
//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlhjk6a.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const instrumentsCollection = client
      .db("Rhythmic")
      .collection("instruments");

    const instructorsCollection = client
      .db("Rhythmic")
      .collection("instructors");
    const admissionCollection = client.db("Rhythmic").collection("admission");
    const usersCollection = client.db("Rhythmic").collection("users");

    // ---------Users-----------

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user exists..." });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const newUser = req.body;
      const updatedUser = {
        $set: {
          role: newUser.role,
        },
      };
      const result = await usersCollection.updateOne(filter, updatedUser);
      res.send(result);
    });

    // ---------Instruments------------

    app.get("/instruments", async (req, res) => {
      const result = await instrumentsCollection.find().toArray();
      res.send(result);
    });

    app.post("/instruments", async (req, res) => {
      const newInstrument = req.body;
      const result = await instrumentsCollection.insertOne(newInstrument);
      res.send(result);
    });

    app.put("/instruments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const newInstrument = req.body;
      const options = { upsert: true };
      const updatedInstrument = {
        $set: {
          role: newInstrument.role,
          feedback: newInstrument.feedback,
        },
      };
      const result = await instrumentsCollection.updateOne(
        filter,
        updatedInstrument,
        options
      );
      res.send(result);
    });

    app.patch("/instruments/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const newInstrument = req.body;
      const updatedInstrument = {
        $set: {
          role: newInstrument.role,
        },
      };
      const result = await instrumentsCollection.updateOne(
        filter,
        updatedInstrument
      );
      res.send(result);
    });

    // --------Instructors-----------

    app.get("/instructors", async (req, res) => {
      const result = await instructorsCollection.find().toArray();
      res.send(result);
    });

    app.get("/instructors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await instructorsCollection.findOne(query);
      res.send(result);
    });

    // -------

    // --------Admission-----------

    app.get("/admission", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await admissionCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const subject = req.body;
      const result = await admissionCollection.insertOne(subject);
      res.send(result);
    });

    app.delete("/admission/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await admissionCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("rhythmic academy is good");
});

app.listen(port, () => {
  console.log(`the port is running on the port no: ${port} `);
});
