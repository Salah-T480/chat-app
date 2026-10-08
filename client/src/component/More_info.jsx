import {FaArrowLeft} from 'react-icons/fa'

export default function MoreInfo({setShowInfoPage,online}){
    function hundleOnReturnToChatPage(){
        setShowInfoPage(old=>!old);
    }
    return (
    <div className="more_info_container">
        <div className="more_info_header">
            <FaArrowLeft id='more_info_header_arrow' onClick={hundleOnReturnToChatPage} ></FaArrowLeft>
        </div>
        <div className="more_info_scroll_container">
            <div className="group_card">
                <div className="group_card_profile">
                    <img src="/src/assets/vite.svg" alt="" />
                </div>
                
                <div className="group_card_name">
                    General
                </div>
                
                <div className="group_card_nbr_online">
                    {online.length} online
                </div>    
            </div>
            <div className="members_container">
                <div className="members_header">
                    members:
                </div>
                <ul className="members_list">
                    {
                        online.map(user=>
                            <li className="user_card">
                                <img src="/src/assets/vite.svg" className='user_card_profile' alt="" />
                                <div className="user_card_name"> {user} </div>
                            </li>
                        )
                    }
                    
                    
                </ul>
            </div>
        </div>
    </div>)

}