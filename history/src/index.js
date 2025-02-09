const express = require("express");

const PORT = process.env.PORT;

async function main() {
  const app = express();

  app.listen(PORT, () => console.log("Microservice online."));
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
