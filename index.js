const { funcionPalabra } = require("./src/controllers/funcionPalabra");
const { scrapper } = require("./src/scrapper/scrapper");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use((req, res, next) => {
  res.setTimeout(300000);
  next();
});
app.use(cors());
app.use(
  express.static(
    path.join(
      __dirname,
      "../front",
    ),
  ),
);

app.get("/api/v1/productos/:palabra", funcionPalabra);

app.listen(3000, () => {
  console.log("Escuchando en http://localhost:3000");
});
