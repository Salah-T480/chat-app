import ContactNav from './component/Contact_nav'
import ChatContainer from './component/Chat_container'
import { useEffect, useRef, useState } from 'react'


 export default function ResizableContainer({username,socket}){
    const [width,setWidth] = useState(250);
    const [minWith,maxWidth] =  [ 200 ,350] ;
    const isResizing = useRef(false) ;
    const [selected,setSelected] = useState({
        contactType : "room" ,
        roomName : "general" 
    });
    // selected = { contactType : "dm" , roomName : "Bob"} for direct message (contact)

    const [componentType , setComponentType] = useState({
        rooms   : ["general"] ,
        dms     : ["Bob","Ali"]
    })
    const [globalHistory,setGlobalHistory] = useState( new Map());
    //globalHistory = Map( "roomName" -> historyList   )
    // historyList = [  Map("msg" -> { id , message , room , sender ,time } ) , 
    //                  Map( "event" -> { info : "ALI join this room", time: 1793373292025 } )    
    //                ]
    const [contacts ,setContacts]= useState(['general','Bob',"Ali"]);
    const history = globalHistory.get(selected.roomName) ;
    //console.log("[ResizableContainer] : history",history);
    console.log("[ResizableContainer] : globalHistory",globalHistory);
    

    useEffect(()=>{
        function onOld(old){
            // old = [ [roomA , [history ,history ], [roomB , [history ,history ] ] 
            // history = { id , message , room , sender ,time  } 
            //console.log("[ResizableContainer] : old",old);
            const updatedOld = old.map((entry,)=>{
                const [room, historyList] = entry ;    
                //console.log("[ResizableContainer] : h',h);
                
                const new_historyList =    historyList.map( historyObj => {
                    const to_map = new Map();
                    to_map.set('msg',historyObj);
                    return to_map ;
                });
                return [room,new_historyList] ;
            });
            //console.log("[ResizableContainer] : update',updatedOld);
            // updatedOld = [ [roomA , [historyMap ,historyMap ], [roomB , [historyMap ,historyMap ] ]
            // historyMap = { "msg" : { id , message , room , sender ,time } }
            setGlobalHistory( new Map(updatedOld) );
            //console.log("[ResizableContainer] : hi i here");
            //console.log("[ResizableContainer] : supposed",new Map(updatedOld));
        }
        socket.on('post old messages', onOld);

        return ()=>socket.off('post old messages',onOld);
        
    },[]);
    function hundleAddDataToHistory (data,to){

        setGlobalHistory((oldGlobalHistory)=>{
            const room =to ;
            //console.log("[ResizableContainer] : room",room);
            //console.log("[ResizableContainer] : data",data);
            const newGlobalHistory = new Map(oldGlobalHistory);
            if(newGlobalHistory.has(to)){
                const oldRoomHistory = newGlobalHistory.get(room) ;
                newGlobalHistory.set(room,[...oldRoomHistory,data]);
            }
            else{
                newGlobalHistory.set(room , [data]);
            }
            return newGlobalHistory ;
        });
    }

    function hundleClearRoomHistory(roomName){
        setGlobalHistory((oldGlobalHistory)=>{
            const newGlobalHistory = new Map(oldGlobalHistory);
            newGlobalHistory.set(roomName,[]);
            return newGlobalHistory;
        })
    }

    function getcomponentType(name){
        return ( componentType["dms"].includes(name) ? "dm": "room" );
    }
    function hundleLastMessages(historyList,roomName){
        const data= new Map() ;
        data.set("roomName",roomName) ;
        data.set("componentType",getcomponentType(roomName))
        if(historyList.length != 0){
            const lastMapObj = historyList.at(-1) ;
            //console.log("[ResizableContainer] : istoryList);
            //console.log("[ResizableContainer] : astMapObj);
            if(lastMapObj.has("msg")){
                const lastMessageObj = lastMapObj.get("msg") ;
                const sender = lastMessageObj["sender"];
                const message = lastMessageObj["message"];
                const time = lastMessageObj["time"];
                data.set("sender",sender);
                data.set("message",message);
                data.set("time",time);
                data.set("type","msg");
            }
            else {
                const lastEventObj = lastMapObj.get("event") ;
                const info = lastEventObj["info"];
                const time = lastEventObj["time"];
                data.set("info",info);
                data.set("time",time);
                data.set("type","event");
            }
        }else{
            data.set("type","empty"); // for empty room 
        }
        //console.log(" [ResizableContainer] :data ",data);
        return data ;
    }
    function getLastMessagesForEachContacts(globalHistory){
        const last = new Array();
        for( const [roomName,historyList] of globalHistory.entries() ){
            //console.log("[ResizableContainer] : istoryList,roomName);
            const res = hundleLastMessages(historyList,roomName) ;
            //console.log("[] res:" ,res);
            last.push(res) ;
        }
        //console.log("[ResizableContainer] : ast);
        //console.log("last ",last);
        return last ;
    }   
    const lastMessagesAndEvents = getLastMessagesForEachContacts(globalHistory);
    //console.log("[ResizableContainer] : lastMessagesAndEvents",lastMessagesAndEvents);
//    console.log("[ResizableContainer] : lobalHistory);
    useEffect(()=>{
        socket.emit('get old messages',contacts);
    },[]);

    function hundleOnMoseDown(){
        isResizing.current = true ;
    }
    useEffect(()=>{
        function hundleOnMouseMove(e){
            e.preventDefault();
            if(!isResizing.current) return ;
            setWidth((oldWidth)=>{
                //console.log("[ResizableContainer] : ldWidth);
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

    useEffect(()=>{
        const hundleDm = (obj)=>{
            const to = obj.to ;
            const from = obj.from ;
            const message = obj.message ;
            const time = obj.time ;
            const data = {
                    sender : from ,
                    message : message ,
                    time : time ,
            };
            const newMessage = new Map() ;
            newMessage.set("msg",data);
            setGlobalHistory((old)=>{
                const newGlogbalHistory = new Map(old);
                if(old.has(from)){
                    const oldHistory =  old.get(from) ;
                    const newHistory =  [...oldHistory , newMessage];
                    newGlogbalHistory.set(from,newHistory);
                }
                else {
                    // spam 
                    newGlogbalHistory.set(from,[newMessage]);
                }
                //console.log("[DM]",newGlogbalHistory);
                return newGlogbalHistory ;
            })
            setComponentType(old=>{
                return {...old , dms: [...old.dms , from]};

            })
            

        }
        const hundleDmSent = (obj)=>{
            const to = obj.to ;
            const from = obj.from ;
            const message = obj.message ;
            const time = obj.time ;
            const data = {
                    sender : from ,
                    message : message ,
                    time : time ,
            };
            const newMessage = new Map() ;
            newMessage.set("msg",data);
            setGlobalHistory((old)=>{
                const newGlogbalHistory = new Map(old);
                if(old.has(to)){
                    const oldHistory =  old.get(to) ;
                    const newHistory =  [...oldHistory , newMessage];
                    newGlogbalHistory.set(to,newHistory);
                }
                else {
                    // spam 
                    newGlogbalHistory.set(to,[newMessage]);
                }
                //console.log("[DM]",newGlogbalHistory);
                return newGlogbalHistory ;
            })
            setComponentType(old=>{
                return {...old , dms: [...old.dms , to]};

            })

        }
        socket.on("dm" ,hundleDm);
        socket.on("dm sent" ,hundleDmSent);
        
        return ()=> {
            socket.off("dm",hundleDm);
            socket.off("dm sent",hundleDmSent);
        
        }

    },[])


    return <>
        <div className="nav_chat_conatiner">
            <ContactNav width = {width} hundleSelected ={setSelected} contacts ={contacts}
                          lastMessagesAndEvents ={lastMessagesAndEvents}      
            ></ContactNav>
            <div id='bar' onMouseDown={hundleOnMoseDown}  > 
            
            </div>
            <ChatContainer username={username} socket={socket} hundleAddDataToHistory={hundleAddDataToHistory} 
                            history={history} key={selected.roomName}  id={selected.roomName} selected={selected}
                            hundleClearRoomHistory={hundleClearRoomHistory}
                            
                            ></ChatContainer>
        </div>
    </>
 }