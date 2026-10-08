import InputMessage  from './Input_message'
import DisplayMessage from './Display_message'
import Info  from './Info'
import {useRef} from 'react'
import { useEffect, useState } from 'react';
import MoreInfo from "./More_info";



function ChatContainer({username,socket}){
    const myRef = useRef(null) ;
    const [history,setHistory] = useState([]);
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
    useEffect(()=>{
        socket.on('new message',(obj)=>{
            const data = new Map();
            data.set('msg',obj);
            setHistory((old)=>[...old,data]);
        })
        return ()=>{
            socket.off('new message');
        }
    },[socket])

    useEffect(()=>{
        socket.on('new user join a room',(new_user)=>{
            const data =  new Map() ;
            data.set('event',`${new_user} join this room`);
            setHistory(old=>[...old,data]);
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
        {showInfoPage? <MoreInfo  setShowInfoPage={setShowInfoPage} online={online}></MoreInfo>
                    :    
                    <>
                        <Info socket={socket} setHistory={setHistory} setShowInfoPage={setShowInfoPage} numberOnline={numberOnline} ></Info>    
                        <DisplayMessage history={history} setHistory={setHistory}
                                        socket={socket} username={username} myRef={myRef}
                                        hundleScoll={hundleScoll} 

                        ></DisplayMessage>
                        <InputMessage username={username} socket={socket} hundleScoll={hundleScoll} ></InputMessage>
                    </>
        }
        </div></>
}

export default ChatContainer;