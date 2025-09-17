import express from 'express'
import { Server } from 'socket.io';
import http, { request } from "http";
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { constants } from 'buffer';

const port = 3000;
const secretKeyJwt = "meranaamjankarkyapasswordtodlegamc";
const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5174",
        methods:["GET","POST"],
        credentials:true,
    }
});

app.use(cors({
    origin:"http://localhost:5174",
    methods:["GET","POST"],
    credentials:true,
}));


app.get("/",(req, res) => {
    res.send("hello world");
})


const user = false;

io.use((socket, next)=>{
    next();
})

io.on("connection",(socket) => {
    console.log("User connected",socket.id);
    //socket.emit("welcome",`welcome to the server`);
    //socket.broadcast.emit("welcome",`${socket.id} joined the server`);

    socket.on("message",({room, message})=>{
        console.log(room, message);
        //socket.broadcast.emit("receive-message",data);
        io.to(room).emit("receive-message",message);
    })

    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`user joined room ${room}`);
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })    

})

server.listen(port,() => {
    console.log(`server is running on port ${port}`);
});