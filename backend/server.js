// To use express.js in our file. Before that we have to install it using 'npm i express' command
const express = require("express");

// To use .env file in our app
const dotenv = require("dotenv");

// importing chats from data.js file
const { chats } = require("./data/data");
const connectDB = require("./config/db");

const colors = require("colors");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// TO config .env file
dotenv.config();

// Calling the function which connects with mongoDB database
connectDB();

// Create an instance of express to craete api and all other things
const app = express();

// To tell the server to accept json data from frontend
app.use(express.json());

// Api endpoint to get data
// Here first parameter is route on which we get data and
// second is callback function - req ==> what we get from url or from user and res ==> what we send to user
app.get("/", (req, res) => {
  // It will print this when we start server
  // TO start server use 'npm start'
  res.send("API IS WORKING ABSOLUTELY FINE");
});

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

// To handle the error in our express app, we are using these error handler middlewares
// If any of the above url's will not work, then it falls in these 2 error handlers and give proper error messages
app.use(notFound);
app.use(errorHandler);

// create variable from .env file for use
const PORT = process.env.PORT || 5000;

// It print whenever we start the server in terminal
app.listen(
  PORT,
  console.log(`My node server started on port ${PORT}`.yellow.bold)
);
