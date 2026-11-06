

function ContactCard({onSelect,lastMapObj}){

    const componentType = lastMapObj.get("componentType");
    //console.log(componentType);
    //console.log("[ContactCard] : lastMapObj",lastMapObj);
    const roomName = lastMapObj.get("roomName") ;
    if (lastMapObj.get("type")!=="empty"){
        //console.log(lastMapObj.get("time").toString());
        new Date(lastMapObj.get("time")).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",hour12: false  });
    }
    const time = lastMapObj.get("type")==="empty" ? "": new Date(lastMapObj.get("time")).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",hour12: false  });
    let body  = <div></div>;
    
    switch(lastMapObj.get("type")){
        case "msg":{
            const sender = lastMapObj.get("sender")+"kdkdldfs;fafa" ;
            let message = lastMapObj.get("message") ;
            if(message.length>17){
                message = message.slice(0,17)+"....";
            }
            body = <>
                <div className="contact_card_sender_message_container">
                    <span className="contact_card_sender" > {sender}:</span>
                    <span className="contact_card_message" > {message}  </span>
                </div>
                
                </>
            break
        }
        case "event":{
            const info = lastMapObj.get("info") ;
            //console.log("info",info);
            body =<>
                <div className='contact_card_message'>{info.slice(0,30)}</div>
            </>
            break
        }
        default  :{
            body=<>
                <div>
                    <span className="contact_card_sender" > </span>
                    <span className="contact_card_message" > </span>
                </div>
            </>

        }
    
    }
     
    return <>
        <div className="contact_card" onClick={()=>{
            onSelect({
                contactType : componentType ,
                roomName : roomName 
            }); 
            //console.log(roomName);
            }} >
            <div className="contact_card_porfile">
                <img src="src/assets/vite.svg" alt="log" />
            </div>
            <div className="contact_card_content">
                <div className="contact_card_roomName">{roomName}</div>
                {body}
            </div>
            <div className="contact_card_time" >{time}</div>
        </div>
    
    </>
}

export  default ContactCard ;