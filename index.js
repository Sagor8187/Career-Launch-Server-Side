const express = require('express');
const cors = require("cors");
const app = express()
const port = 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
app.use(cors())
app.use(express.json());



const uri = process.env.MONGO_DB_URI
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
     await client.connect();
     const database = client.db("job-portal");
    const Jobcollection = database.collection("jobs");
    const  companycollection = database.collection("company")

    //Recruiter Job post api 
    app.post("/api/jobs",async(req,res)=>{
      const job = req.body;
      const result =await Jobcollection.insertOne(job)
      res.status(201).send({success: true,message: "Job created successfully",result});
    })

    
    // company base job show 
    app.get("/api/jobs",async(req,res)=>{
      const query = {}
      if(req.query.companyId){
        query.companyId = req.query.companyId
      }

       if(req.query.status){
        query.status = req.query.status
      }
  
      const  cursor =await Jobcollection.find(query)
      const result =await cursor.toArray()
   
      res.send(result)
    })

    app.post("/api/company",async(req,res)=>{
      const company = req.body;
      const result = await companycollection.insertOne(company)
      res.status(201).send({success: true,message: "Job created successfully",result});
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})