const express = require("express");
const router = require("./routes");
require("dotenv").config();

const pool = require('./db.connection.js');
const cors=require("cors")
const app = express();

app.use(
  cors({
    credentials: true,
    origin:["http://localhost:3000"],
  })
);

app.use(express.json())
app.use(router);

const PORT = process.env.PORT;
app.listen(8000, () => {
  console.log(`Server started at http://localhost:8000/ping`);
});
