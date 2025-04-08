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
const messageRoutes = require("./routes/messageRoutes");

const path = require("path");

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

// app.get("/", (req, res) => {
//   // It will print this when we start server
//   // TO start server use 'npm start'
//   res.send("API IS WORKING ABSOLUTELY FINE");
// });

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API Running");
  });
}

// --------------------------deployment------------------------------

// To handle the error in our express app, we are using these error handler middlewares
// If any of the above url's will not work, then it falls in these 2 error handlers and give proper error messages
app.use(notFound);
app.use(errorHandler);

// create variable from .env file for use
const PORT = process.env.PORT || 5000;

// It print whenever we start the server in terminal
const server = app.listen(
  PORT,
  console.log(`My node server started on port ${PORT}`.yellow.bold)
);

// To craete a connextion at client side
// PingTimeout is time till this connection is open while being inactive means after 60 sec of inactivity connection will be close to save the bandwidth
// cors - so that we can't get cross origin errors means without spcificslly specify the headers a domain cant make request to other domain so that sensitive data is protected
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://talk-a-tive-fiz9.onrender.com",
    // credentials: true,
  },
});

// in io.on first param is name of socket connection and
// inside it socket.on is used to create personalized room whenever any user opens the chats
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    //console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
