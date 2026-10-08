import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

import fs from 'fs-extra'
import betterSqlite3 from 'better-sqlite3'


const dir = import.meta.dirname ;


const app = express();
app.use(cors());

const server = http.createServer(app) ;
const io = new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})
        

if(!fs.existsSync(`${dir}/db`)){
    fs.mkdirSync(`${dir}/db`);
}

function addToUsersDb(id,username,room){
    IdToUsername.set(id,username);
    userNameToId.set(username,id);
}
function removeUserFromDB(id,username){
    IdToUsername.delete(id);
    userNameToId.delete(username);
}
function getUserNameFromDB(id){
    if(IdToUsername.has(id)) return IdToUsername.get(id);
    return null;
}
function getIdFromDB(username){
    if(userNameToId.has(username)) return userNameToId.get(username);
    return null;
}

function checkIfUserNameExist(username){
    return userNameToId.has(username);
}

function updateUserNameInDb(id,username,old){
    IdToUsername.set(id,username);
    userNameToId.delete(old);
    userNameToId.set(username,id);
    
}


const roomsHistoryDB = new betterSqlite3(`${dir}/db/roomsHistory.db`);
roomsHistoryDB.exec(`
    create table if not exists roomsHistory (
    id integer primary key ,
    room text not null ,
    time  numeric not null ,
    sender text not null,
    message text not null 
)`);

function addToRoomsHistoryDB(room,time,sender,message){
    const req = roomsHistoryDB.prepare(`insert into roomsHistory(room,time,sender,message) values (@room,@time,@sender ,@message) `);
    req.run({room:room,time:time,sender:sender,message:message});
}
function updateRoomsHistoryDB(old,newName){
    const req = roomsHistoryDB.prepare(`update roomsHistory set sender = @newName where sender =@old `);
    req.run({old,newName});
}
function getOldMessages(room){
    const req = roomsHistoryDB.prepare(` select * from (select * from roomsHistory where room = @room order by time desc limit @limit) order by time asc`);
    return req.all({room:room,limit:MaxRecoveredMessages});
}


function getLastMessageTimeSent(id){
    if(lastMessageTimeSent.has(id)) return lastMessageTimeSent.get(id);
    return null;
}
function setLastMessageTimeSent(id,time){
    lastMessageTimeSent.set(id,time);
}
function deleteFromlastMessageTimeSentDB(id){
    lastMessageTimeSent.delete(id);
}


const  userNameToId = new Map();
const  IdToUsername = new Map();
const lastMessageTimeSent = new Map();
const CoolDownTime = 100 ;
const MaxRecoveredMessages = 20 ;
const MaxMessageLength = 500 ;

function clearHistoryForEmptyRooms(room){
    if(room==='general') return ;
    if(!io.sockets.adapter.rooms.has(room) ){
        const req = roomsHistoryDB.prepare(`delete from roomsHistory  where room = @room`);
        req.run({room:room});
    }
}
function isValideUserName(socket,username){
    const names = checkIfUserNameExist(username);
    if(names){
        socket.emit('username taken',username);
        return false ;
    }
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
function getOnlineUsers(socket){
    const room  = socket.room ;
    const socketsInRoom = io.sockets.adapter.rooms.get(room) || new Set();
    const names = Array.from(socketsInRoom).map(id=> getUserNameFromDB(id));
    return names ;
}

io.on('connection',(socket)=>{    
    socket.on('set username',(username)=>{
        //console.log(userNameToId);
        if(isValideUserName(socket,username)){
            socket.emit('valid',username);
            addToUsersDb(socket.id,username,'general');
            socket.join('general');
            socket.room= 'general';
            console.log(`${username} connected with socketID ${socket.id} `);
            console.log(`${username} joined the general room `);

            socket.to(socket.room).emit('new user join a room',username);
            socket.to(socket.room).emit('online users',getOnlineUsers(socket));
           
            socket.emit('recover last messages','general',getOldMessages('general'));
        }

    })
    socket.on('get online users',()=>{
        socket.emit('online users',getOnlineUsers(socket));
    })
    socket.on('message',(msg)=>{
        const now = Date.now();
        const lastTime = getLastMessageTimeSent(socket.id);
        if(lastTime){
            const elapsed  = now - lastTime ;
            const timeToWaitMs = CoolDownTime - elapsed ;
            if(timeToWaitMs>0){
                socket.emit('cooldown',Math.ceil(timeToWaitMs/1000));
                return;
            }
        }
        const name = getUserNameFromDB(socket.id) ;
        if(!name) return;
        if(!msg.trim()) return ;
        if(msg.length>MaxMessageLength){
            socket.emit('error',`message too long (max ${MaxMessageLength} chars)`);
            return ;
        }
        addToRoomsHistoryDB(socket.room,Date.now(),name,msg);
        const data  =  {
            sender : name ,
            time : now ,
            message : msg 
        }
        io.to(socket.room).emit('new message',data);
        //socket.to(socket.room).emit('new message',data);
        setLastMessageTimeSent(socket.id,now) ;
    })
    socket.on('join',(room)=>{
        if(!room){
            socket.emit('error','please enter a valid room name');
            return;
        }
        const name = getUserNameFromDB(socket.id) ;
        if(socket.room) {
            socket.leave(socket.room);
            console.log(`${name} left ${socket.room}`);
            socket.to(socket.room).emit('user left the room',name);
            clearHistoryForEmptyRooms(socket.room);
        }
        socket.join(room);
        socket.room = room ;
        console.log(`${name} joined the room : ${room}`);
        socket.emit('joined',room);
        socket.to(room).emit('new user join a room',name);
        const history = getOldMessages(room);
        
        if(history){
            socket.emit('recover last messages',room,history);
        }
    })
    socket.on('msg',(data)=>{
        const now = Date.now();
        const lastTime = getLastMessageTimeSent(socket.id);        
        if(lastTime){
            const elapsed  = now - lastTime ;
            const timeToWaitMs = CoolDownTime - elapsed ;
            if(timeToWaitMs>0){
                socket.emit('cooldown',Math.ceil(timeToWaitMs/1000));
                return;
            }
        }
        if(!checkIfUserNameExist(data.user)){
            socket.emit('error','no user found named '+data.user);
            return;
        }
        const fullText = data.text.join(' ').trim();
        if(!fullText) return;
        if(fullText.length>MaxMessageLength){
            socket.emit('error',`message too long (max ${MaxMessageLength} chars)`);
            return ;
        }
        const name = getUserNameFromDB(socket.id) ;
        const targetId = getIdFromDB(data.user);
        socket.to(targetId).emit('dm',name,fullText);
        socket.emit('dm sent',data.user,fullText);
        setLastMessageTimeSent(socket.id,now) ;
    })
    socket.on('leave',()=>{
        const name = getUserNameFromDB(socket.id) ;
        if(socket.room){
            socket.leave(socket.room);
            console.log(`${name} left ${socket.room}`);
            socket.to(socket.room).emit('user left the room',name);
            clearHistoryForEmptyRooms(socket.room);
        }
        socket.join('general');
        socket.room = 'general';
        console.log(`${name} re-joined the room : general`);
        socket.to(socket.room).emit('new user join a room',name);
        socket.emit('joined','general');
        const history = getOldMessages('general');
        if(history){
            socket.emit('recover last messages','general',history);
        }
    })
    socket.on('disconnect',()=>{
        const name = getUserNameFromDB(socket.id) ;
        if(name){
            console.log(`${name} disconnected`);
            socket.to(socket.room).emit('system', name );
            socket.to(socket.room).emit('online users',getOnlineUsers(socket));
            removeUserFromDB(socket.id,name);
            deleteFromlastMessageTimeSentDB(socket.id);
            clearHistoryForEmptyRooms(socket.room);
        }
    })
    socket.on('room',()=>{
        socket.emit('current room',socket.room  || 'none');
    })
    socket.on('who',()=>{
        const room  = socket.room ;
        const socketsInRoom = io.sockets.adapter.rooms.get(room) || new Set();
        const names = Array.from(socketsInRoom).map(id=> getUserNameFromDB(id));
        socket.emit('who',names);
    })
    socket.on('rooms',()=>{
        const rooms = Array.from(io.sockets.adapter.rooms.keys())
                    .filter(r=>!io.sockets.sockets.has(r));
        socket.emit('active rooms',rooms);
    })
    socket.on('nick',(newUserName)=>{
    if(isValideUserName(socket,newUserName)){
            const oldUserName = getUserNameFromDB(socket.id);
            updateUserNameInDb(socket.id,newUserName,oldUserName);
            updateRoomsHistoryDB(oldUserName,newUserName);
            console.log(`${oldUserName} changed his name to ${newUserName}`);
            io.emit('a username changed',{old:oldUserName,newOne: newUserName});
            socket.emit('client data changed',newUserName);
        }
        
    })
})


server.listen(5000,()=>{
    console.log('server on port 5000');
})