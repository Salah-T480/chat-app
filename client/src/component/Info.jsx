import { useState } from 'react'
import {FaEllipsisV} from 'react-icons/fa'
import  RoomOptions from './Room_options'
function Info({numberOnline,setHistory,setShowInfoPage}){
    const [showOp,setShowOp] = useState(false);
    
    
    function hundleOnClear(){
        setHistory([]);
        setShowOp(false);
    }
    function hundleOnShowMoreInfo(){
        setShowInfoPage(old=>!old);
    }
    return <>
        <div className="info">
            <div className="room_profile">
                <img src="/src/assets/vite.svg" alt="" />
            </div>
            <div className="room_content">
                <div className="room_name">General</div>
                <div className="room_online_users">{numberOnline} online</div>
            </div>
            <div className="room_options">
                <FaEllipsisV id='room_three_dots' onClick={(e)=>{setShowOp(!showOp);e.stopPropagation()}} > </FaEllipsisV>
                <RoomOptions toShow={showOp} hundleOnClear={hundleOnClear} hundleOnShowMoreInfo={hundleOnShowMoreInfo} setShowOp={setShowOp} ></RoomOptions>
            </div>
            
           
            
        </div>
    
    </>
}


export default Info ;