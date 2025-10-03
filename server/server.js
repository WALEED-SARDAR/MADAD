require("dotenv").config();
const cors = require("cors");
const express = require("express");
const Routes = require("./routes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
}));

// Connect to MongoDB
connectDB();

//Routes
app.use("", Routes);

//Error Handler
app.use(errorHandler);

//Server Config
const server = app.listen(process.env.PORT || 5001, () =>{
    console.log("server is running on PORT, ", process.env.PORT || 5001)
});