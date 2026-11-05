import { useState } from 'react';
import {FaPaperPlane} from 'react-icons/fa';


function InputMessage({socket,hundleScoll,selected}){
    const [userInput,setUserInput]= useState('');
    const componentType = selected["contactType"] ;
    const roomName = selected["roomName"] ;
    function onSend(){
        if(componentType === 'dm'){
            const data = {
                text : userInput ,
                user : roomName 
            }
            socket.emit('msg',data) ;
        }
        else{
            socket.emit('message',userInput,roomName);
        }
        //console.log("roomName",roomName);
        //console.log("componentType",componentType);
        setUserInput('');
        setTimeout(hundleScoll,100);
        //hundleScoll() ;
    }

    return <>
    
    <div className="input_message">
        <input type="text" placeholder='Message' value={userInput}  autoFocus
                onChange={(e)=>setUserInput(e.target.value)}
                onKeyDown={ (e)=> e.key=='Enter' && onSend()}
                />
        <FaPaperPlane id='send' onClick={onSend} ></FaPaperPlane>
    </div></>
}

export default InputMessage ;