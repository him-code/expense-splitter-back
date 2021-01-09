const express = require("express");
const MainRouter = require("./routes/index");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect("mongodb://localhost:27017/spliter", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const server = require("http").createServer(app);

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

server.listen(3003, function () {
  console.log("Beast is waiting at 3003 port");
});

app.use(router);
MainRouter(app);
