const express = require("express");
const mongodb = require("mongodb");
const amqp = require("amqplib");

const PORT = process.env.PORT;
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;
const RABBIT = process.env.RABBIT;

async function main() {
  const app = express();

  app.use(express.json());

  const client = await mongodb.MongoClient.connect(DBHOST);
  const db = client.db(DBNAME);
  const historyCollection = db.collection("videos");

  const messagingConnection = await amqp.connect(RABBIT);
  console.log("Connected to RabbitMQ.");

  const messageChannel = await messagingConnection.createChannel();

  await messageChannel.assertQueue("viewed", {});
  console.log(`Created "viewed" queue.`);

  await messageChannel.consume("viewed", async (msg) => {
    console.log("Received a 'viewed' message");

    const parsedMsg = JSON.parse(msg.content.toString());

    await historyCollection.insertOne({ videoPath: parsedMsg.videoPath });

    console.log("Acknowledging message was handled.");

    messageChannel.ack(msg);
  });

  app.listen(PORT, () => console.log("Microservice online."));
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
