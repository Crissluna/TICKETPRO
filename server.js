const express = require("express");
const bodyParser = require("body-parser");
const mongoogse = require("mongoose");
const app = express();
const userRoutes = require("./app/routes/userRoutes");
const cors = require("cors");
const path = require("path");
const loginRoutes = require("./app/routes/loginRoutes");
const dotenv = require("dotenv");
const createEvent = require("./app/routes/adminEvents");
const loadDataRouter = require("./app/routes/loadData");
const session = require("express-session");
const verifyToken = require("./app/controllers/tokenVerify");
require("dotenv").config();

const createSession = require("./app/controllers/createSession");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

mongoogse.connect(
  "mongodb+srv://cesarley00:uFWLCDF70qJXcpAW@cluster0.2r0glfx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(
  cors({
    origin: "http://localhost:5500",
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("app"));
app.use("/views", express.static("views"));

app.get("/", (req, res) => {});

app.use("/api/users", userRoutes);
app.use("/api/users", loginRoutes, createSession);
app.use("/api/admin", createEvent);
app.use("/api/users", verifyToken, loadDataRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
