import {FaEllipsisV} from 'react-icons/fa'

function Info(){
    return <>
        <div className="info">
            <div className="room_profile">
                <img src="/src/assets/vite.svg" alt="" />
            </div>
            <div className="room_content">
                <div className="room_name">General</div>
                <div className="room_online_users">2 online</div>
            </div>
            <FaEllipsisV id='room_three_dots'></FaEllipsisV>
            
        </div>
    
    </>
}


export default Info ;