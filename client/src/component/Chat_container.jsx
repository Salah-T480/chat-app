import InputMessage  from './Input_message'
import DisplayMessage from './Display_message'
import Info  from './Info'
import {useRef} from 'react'



function ChatContainer({username,socket}){
    const myRef = useRef(null) ;
    function hundleScoll(){
        if(myRef.current){
            myRef.current.scrollIntoView({ behavior: 'smooth' });
        }

    }

    return <>
    
    <div className="chat_container">
        <Info></Info>    
        <DisplayMessage socket={socket} username={username} myRef={myRef} hundleScoll={hundleScoll}  ></DisplayMessage>
        <InputMessage username={username} socket={socket} hundleScoll={hundleScoll} ></InputMessage>
    </div></>
}

export default ChatContainer;