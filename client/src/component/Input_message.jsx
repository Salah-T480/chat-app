import { useState } from 'react';
import {FaPaperPlane} from 'react-icons/fa';


function InputMessage({socket,hundleScoll}){
    const [userInput,setUserInput]= useState('');
    function onSend(){
        socket.emit('message',userInput);
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