import MessageCard from './Message_card' 
import {FaArrowCircleDown}  from 'react-icons/fa'


function DisplayMessage({username,myRef,hundleScoll,history}){
    
    
   
    
    
    return <>
    <div className="display_message">
        {
            history.map((obj,i)=>{
                if(obj.has('msg')){
                    const data = obj.get('msg');
                    return <MessageCard sender={data.sender} time={data.time} message={data.message} key={i} username={username} ></MessageCard>   
                }
                else{
                    const event = obj.get('event');
                    return <div className="event_container">
                        <p id='event'> {event} </p>
                    </div>
                }
            })

        }
        
        <div className="ref" ref = {myRef}  ></div> 
        <div className="driver" >
            <FaArrowCircleDown id='arrow' onClick={hundleScoll} ></FaArrowCircleDown>
        </div>
    </div>

    </>
}


export default DisplayMessage ;