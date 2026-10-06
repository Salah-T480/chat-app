import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io';



const app = express();
app.use(cors());

const server = http.createServer(app) ;
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})




function isValideUserName(socket,username){
    /* 
    const names = checkIfUserNameExist(username);
    if(names){
        socket.emit('username taken',username);
        return false ;
    } */
    if(username.split(' ').length>1){
        socket.emit('invalid username','you must enter a single username with no white space !');
        return false;
    }
    if(!/^[a-zA-Z0-9_-]+$/.test(username)){
        socket.emit('invalid username','username must be letters, numbers, _ or - only');
        return false;
    }
    return true ;
}




io.on('connection',(socket)=>{
    socket.on('set username',(username)=>{
        if(isValideUserName(socket,username)){
            socket.emit('valid',username);
            console.log(`${username} connected with socketID ${socket.id} `);
        }
    })
    socket.on('send',(username,msg)=>{
        const now  = Date.now();
        const data  =  {
            sender : username ,
            time : now ,
            message : msg 
        }
        console.log(data);
        io.emit('new message' , data) ;
    })
    socket.on('disconnect',()=>{
        console.log(`${socket.id} disconnected`);
    })
    
})

server.listen(5000,()=>{
    console.log('server on port 5000');
})