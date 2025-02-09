const express = require("express");
const http = require("http");
const mongodb = require("mongodb");

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST;
const VIDEO_STORAGE_PORT = parseInt(process.env.VIDEO_STORAGE_PORT);
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

function sendViewedMessage(videoPath) {
  const data = JSON.stringify({ videoPath: videoPath });

  const options = {
    hostname: 'history',
    port: 80,
    path: '/viewed',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const req = http.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (err) => {
    console.error("Failed to send viewed message.", err.stack);
  });

  req.write(data);
  req.end();
}

async function main() {
  const client = await mongodb.MongoClient.connect(DBHOST);
  const db = client.db(DBNAME);
  const videosCollection = db.collection("videos");

  const app = express();

  app.get("/video", async (req, res) => {
    const videoId = new mongodb.ObjectId(req.query.id);
    const videoRecord = await videosCollection.findOne({ _id: videoId });

    if (!videoRecord) {
      res.sendStatus(404);
      return;
    }

    const options = {
      hostname: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: `/video?path=${encodeURIComponent(videoRecord.videoPath)}`,
      method: 'GET',
      headers: req.headers,
    };

    const videoReq = http.request(options, (videoRes) => {
      if (videoRes.statusCode !== 200) {
        console.error("Failed to fetch video.");
        res.sendStatus(500);
        return;
      }

      res.writeHead(videoRes.statusCode, videoRes.headers);
      videoRes.pipe(res);
      videoRes.on('end', () => {
        sendViewedMessage(videoRecord.videoPath);
      });
    });

    videoReq.on('error', (error) => {
      console.error("Failed to fetch video.", error);
      res.sendStatus(500);
    });

    videoReq.end();
  });

  app.listen(PORT, () => console.log("Microservice online."));
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
