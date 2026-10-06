import { useEffect, useState } from 'react';
import MessageCard from './Message_card' 
import {FaArrowCircleDown}  from 'react-icons/fa'


function DisplayMessage({socket,username,myRef,hundleScoll}){
    const [history,setHistory] = useState([]);
    
   
    useEffect(()=>{
        socket.on('new message',(data)=>{
            setHistory((old)=>[...old,data]);
        })
        return ()=>{
            socket.off('new message');
        }
    },[socket])
    
    return <>
    <div className="display_message">
        {history.map((data,i)=><MessageCard sender={data.sender} time={data.time} message={data.message} key={i} username={username} ></MessageCard>  )}  
        <div className="ref" ref = {myRef}  ></div> 
        <div className="driver" >
            <FaArrowCircleDown id='arrow' onClick={hundleScoll} ></FaArrowCircleDown>
        </div>
    </div>

    </>
}


export default DisplayMessage ;