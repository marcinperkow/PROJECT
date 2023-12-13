const express = require('express')
const app = express()
const port = 3000
const { connectToDb, getDb} = require("./db")
const { ObjectId } = require('mongodb')
let db

connectToDb((err) =>
{
  if(!err)
  {
    app.listen(port, () =>
    {
      console.log(`Example app listening on port ${port}`)
    })
    db = getDb()
  }
})

//All games endpoint
app.get("/games", (req, res) =>
{
  let games = []

  db.collection("games")
    .find()
    .sort({title: 1})
    .forEach(game => games.push(game))
    .then(() => 
    {
      res.status(200).json(games)
    })
    .catch(() =>
    {
      res.status(500).json({error: "Could not fetch the documents."})
    })
})

//1 game endpoint
app.get("/games/:id", (req, res) =>
{
  if(ObjectId.isValid(req.params.id))
  {
    db.collection("games")
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => 
    {
      res.status(200).json(doc)
    })
    .catch(err =>
    {
      res.status(500).json({error: "Could not fetch the documents."})
    })
  }
  else
  {
    res.status(500).json({error: "Not a valid doc ID."})
  }
  
})