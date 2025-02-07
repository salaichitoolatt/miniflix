const express = require("express");
const fs = require("fs");

const app = express();

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const PORT = process.env.PORT || 3000;

app.get("/video", async (req, res) => {
  const videoPath = "./videos/sample.mp4";

  const stats = await fs.promises.stat(videoPath);

  res.writeHead(200, {
    "content-length": stats.size,
    "content-type": "video/mp4",
  });
  fs.createReadStream(videoPath).pipe(res);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => console.log(`Video service is online.`));
