import ContactNav from './component/Contact_nav'
import ChatContainer from './component/Chat_container'
import { useEffect, useRef, useState } from 'react'


 export default function ResizableContainer({username,socket}){
    const [width,setWidth] = useState(250);
    const [minWith,maxWidth] =  [ 200 ,350] ;
    const isResizing = useRef(false) ;
    function hundleOnMoseDown(){
        isResizing.current = true ;
        console.log('hi');
    }
    useEffect(()=>{
        function hundleOnMouseMove(e){
            e.preventDefault();
            if(!isResizing.current) return ;
            setWidth((oldWidth)=>{
                console.log(oldWidth);
                const newWidth = oldWidth+e.movementX ;
                return Math.max(minWith,Math.min(newWidth,maxWidth)) ;
            });
        }
        function hundleOnMoseUp(){
            isResizing.current = false ;
        }
        window.addEventListener('mousemove',hundleOnMouseMove);
        window.addEventListener('mouseup',hundleOnMoseUp);
        return()=>{
            window.removeEventListener('mousemove',hundleOnMouseMove);
            window.removeEventListener('mouseup',hundleOnMoseUp);
        };

    },[])

    return <>
        <div className="nav_chat_conatiner">
            <ContactNav width = {width}
                                
            ></ContactNav>
            <div id='bar' onMouseDown={hundleOnMoseDown}  > 
            
            </div>
            <ChatContainer username={username} socket={socket} ></ChatContainer>
        </div>
    </>
 }