const express = require("express");
const mongodb = require("mongodb");

const PORT = process.env.PORT;
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

async function main() {
  const client = await mongodb.MongoClient.connect(DBHOST);
  const db = client.db(DBNAME);
  const historyCollection = db.collection("videos");
  const app = express();

  app.use(express.json());

  app.post("/viewed", async (req, res) => {
    const videoPath = req.body.videoPath; 
    await historyCollection.insertOne({ videoPath: videoPath });

    console.log(`Added video ${videoPath} to history.`);
    res.sendStatus(200);
  });

  app.listen(PORT, () => console.log("Microservice online."));
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
