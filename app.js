// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;           // <- Use Render's PORT
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5174";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req, res) => res.send("hello world"));

// create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
  // optional: force websocket transport in case polling causes issues:
  // transports: ["websocket"],
  pingInterval: 25000,
  pingTimeout: 60000
});

io.use((socket, next) => {
  // place to validate auth token if you want: socket.handshake.auth
  next();
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`user joined room ${room}`);
  });

socket.on("message", ({ room, message }) => {
  io.to(room).emit("receive-message", {
    message,
    sender: socket.id
  });
});

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => console.log(`Server listening on port ${port}`));
