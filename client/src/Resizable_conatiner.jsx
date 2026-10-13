import ContactNav from './component/Contact_nav'
import ChatContainer from './component/Chat_container'
import { useEffect, useRef, useState } from 'react'


 export default function ResizableContainer({username,socket}){
    const [width,setWidth] = useState(250);
    const [minWith,maxWidth] =  [ 200 ,350] ;
    const isResizing = useRef(false) ;
    const [selected,setSelected] = useState('general');
    const [globalHistory,setGlobalHistory] = useState( new Map());
    const [contacts ,setContacts]= useState(['general','Bob']);
    const history =globalHistory.get('general') ;
    console.log(history);
    useEffect(()=>{
        socket.emit('get old messages',contacts);
    },[]);
    useEffect(()=>{
        socket.on('post old messages',(old)=>{
            //console.log(old);
            const updatedOld = old.map((entry,)=>{
                const [room,h] = entry ;    
                console.log('h',h);
                
                const new_h =    h.map( obj => {
                    const to_map = new Map();
                    to_map.set('msg',obj);
                    return to_map ;
                });
                return [room,new_h] ;
            });
            console.log('update',updatedOld);
            setGlobalHistory( new Map(updatedOld) );
        }
        );

        return ()=>socket.off('post old messages');
        
    },[]);
    function hundleAddDataToHistory (room,data){
        console.log(room);
        console.log(globalHistory);
        const newGlobalHistory = new Map(globalHistory);
        const oldRoomHistory = globalHistory.get(room) ;
        console.log(oldRoomHistory);
        newGlobalHistory.set(room,[...oldRoomHistory,data]);
        setGlobalHistory(newGlobalHistory);
    }
    console.log(globalHistory);

    function hundleOnMoseDown(){
        isResizing.current = true ;
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
            <ContactNav width = {width} hundleSelected ={setSelected}
                                
            ></ContactNav>
            <div id='bar' onMouseDown={hundleOnMoseDown}  > 
            
            </div>
            <ChatContainer username={username} socket={socket} hundleAddDataToHistory={hundleAddDataToHistory} history={history} key={selected} id={selected} ></ChatContainer>
        </div>
    </>
 }