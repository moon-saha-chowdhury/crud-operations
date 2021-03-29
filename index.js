const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const dbPassword ="ozmkGrWqYJaLq8TP";

const uri = "mongodb+srv://organicUser:ozmkGrWqYJaLq8TP@cluster0.sr6rc.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  //Read or getting data from database
  app.get('/products',(req,res)=>{
      productCollection.find({})
      .toArray( (err, documents)=>{
          res.send(documents);
      })
  })

  //Capturing single id to Update Data 
  app.get('/product/:id', (req,res)=>{
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray( (err, documents)=>{
        res.send(documents[0]); //ekhane sudhu array er first element pathassi tai [0]
    })
  })

  //Updated Data
  app.patch('/update/:id', (req,res)=>{
      productCollection.updateOne({_id: ObjectId(req.params.id)},
      {
          $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result =>{
          res.send(result. modifiedCount > 0)
      })
  })



  //Insert or creating data
  app.post("/addProduct",(req, res)=>{
      const product = req.body;
      productCollection.insertOne(product)
      .then(result =>{
          console.log("data added successfully");
        //   res.send("Success");
        res.redirect('/');
      })
   
    })

   //Deleting element from database as well as UI
    app.delete('/delete/:id', (req,res)=>{
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result =>{
            res.send(result.deletedCount > 0);
        })
    })

});


app.listen(3000);