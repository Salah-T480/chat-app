import { useState } from 'react';
import {FaPaperPlane} from 'react-icons/fa';


function InputMessage({username,socket,hundleScoll}){
    const [userInput,setUserInput]= useState('');
    function onSend(){
        socket.emit('send',username,userInput);
        setUserInput('');
        hundleScoll() ;
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