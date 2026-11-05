import InputMessage  from './Input_message'
import DisplayMessage from './Display_message'
import Info  from './Info'
import {useRef} from 'react'
import { useEffect, useState } from 'react';
import MoreInfo from "./More_info";



function ChatContainer({username,socket,history=[],hundleAddDataToHistory,id,hundleClearRoomHistory,selected}){
    const myRef = useRef(null) ;
    // history = [{'msg': {sender : name ,time : now , message : msg }}, {'event':'ali join this room'}]
    const [showInfoPage,setShowInfoPage]= useState(false);
    const [online , setOnline] = useState([]);
    const numberOnline = online.length ;

    
    useEffect(()=>{
        const hundler = (res)=>{
            setOnline(res);
        }
        socket.on('online users',hundler)
        socket.emit('get online users');
        return ()=>{
            socket.off('online users',hundler);
        }
    },[socket])
    /*
    useEffect(()=>{
        socket.on('recover last messages',(room ,oldHistory)=>{
            //console.log(oldHistory);
            const newHistory = oldHistory.map((obj,)=>{
                const data =  new Map() ;
                data.set('msg',obj);

                return data ;
            })
            setHistory(newHistory);
        })
        return()=>{
            socket.off('recover last messages');
        }
    })
    */
    useEffect(()=>{
        const hundleNewMessage = (obj,to)=>{
            const data = new Map();
            //console.log("obj->",obj);
            data.set('msg',obj);
            hundleAddDataToHistory(data,to);
            //console.log("id",id);
        } ;
        socket.on('new message',hundleNewMessage);
        return ()=>{
            socket.off('new message',hundleNewMessage);
        }
    },[socket])

    useEffect(()=>{
        socket.on('new user join a room',(new_user)=>{
            const data =  new Map() ;
            const obj =  {
                "info" : `${new_user} join this room` ,
                "time" : Date.now() 
            }
            data.set('event',obj);
            //data.set('time', Date.now());
            //console.log(Date.now());
            //hundleAddDataToHistory(data,"");
        })
        return ()=>{
            socket.off('new user join a room');
        }
    },[socket]);

    function hundleScoll(){
        if(myRef.current){
            myRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }
    
    return <>
    
    <div className="chat_container">
        {showInfoPage? <MoreInfo  setShowInfoPage={setShowInfoPage} online={online} roomName={id} ></MoreInfo>
                    :    
                    <>
                        <Info hundleClearRoomHistory={hundleClearRoomHistory} setShowInfoPage={setShowInfoPage} numberOnline={numberOnline} roomName ={id} ></Info>    
                        <DisplayMessage history={history}
                                        socket={socket} username={username} myRef={myRef}
                                        hundleScoll={hundleScoll} 

                        ></DisplayMessage>
                        <InputMessage username={username} socket={socket} hundleScoll={hundleScoll} selected={selected}  ></InputMessage>
                    </>
        }
        </div></>
}

export default ChatContainer;