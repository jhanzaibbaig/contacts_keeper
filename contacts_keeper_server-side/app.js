require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");

const auth = require("./middlewares/auth");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// ROUTES
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

//
app.use("/uploads", express.static("./uploads"));

// SERVER CONFIGURATION
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  connectDB();
  console.log(`server listening on port: ${PORT}`);
});
