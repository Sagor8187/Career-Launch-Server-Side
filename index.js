const express = require('express');
const cors = require("cors");
const app = express()
const port = 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const applicationcollection = database.collection("application")
    const plancollection = database.collection("plans")
    const subscriptioncollection = database.collection("subscription")
    const usercolection = database.collection("user")



    // all job api 
    app.get("/api/all/jobs", async (req, res) => {
    const result = await Jobcollection.find().toArray();

    res.send(result);
  });

  // job details api 

  app.get("/api/all/jobs/:id", async (req, res) => {
  const { id } = req.params;

  const result = await Jobcollection.findOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

    //Recruiter Job post api 
    app.post("/api/jobs",async(req,res)=>{
      const job = {
         ...req.body,
          createdAt: new Date(),
        };
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

    // comapny registration api 

    app.post("/api/registration/company",async(req,res)=>{
      const company = req.body;
      const result = await companycollection.insertOne(company)
      res.status(201).send({success: true,message: "Job created successfully",result});
    })


    // company data get api 
    app.get("/api/my/companies",async(req,res)=>{
      const query = {}
      if(req.query.recruiterId){
        query.recruiterId = req.query.recruiterId;
      }

      const result = await companycollection.findOne(query)
      res.send(result || {})
    })
    

    // create a apllicant post api 

    app.post("/api/application",async(req,res)=>{
      const aplicant = {
        ...req.body,
        createdAt: new Date()
      }
      const result = await applicationcollection.insertOne(aplicant)
       res.status(201).send({success: true,message: "Job apply successfully",result});
      
    })

    // get apllication data 
    app.get("/api/application",async(req,res)=>{
      const query = {}
      if(req.query.jobId){
        query.jobId = req.query.jobId
      }
      if(req.query.applicantId){
        query.applicantId = req.query.applicantId
      }
      const result = await applicationcollection.find(query).toArray()
       res.status(201).send({success: true,result});
    })
    
// get planing data 
app.get("/api/plans",async(req,res)=>{
  const query = {}
  if(req.query.plan_id){
    query.id=req.query.plan_id
  }
  const plan = await plancollection.findOne(query)
  res.send(plan)
})

// subscription collection post api 

app.post("/api/subcription",async(req,res)=>{
  const data = req.body;
  const subInfo = {
    ...data,
    createdAt:new Date()
  }
  const result = await subscriptioncollection.insertOne(subInfo)
  const filter = {email:data.email};
  const updateDocument = {
    $set:{
      plan:data.plan_Id
    },

  }
  const updateresult = await usercolection.updateOne(filter,updateDocument)
  res.send(updateresult)
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



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})