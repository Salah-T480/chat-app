import {FaHome,FaSlidersH,FaUser} from 'react-icons/fa';
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoPersonOutline,IoSettingsOutline,IoLogoReact } from "react-icons/io5";


function Menu(){
    return<>
        <div className="menu" >
            <div className="upper">
                <div className="menu_icons" dfn="chat-app logo" >
                <IoLogoReact ></IoLogoReact>
                </div>
                <div className="menu_icons" dfn="add a contact" >
                    <IoIosAddCircleOutline  ></IoIosAddCircleOutline  >
                </div>
                
                <div className="menu_icons" dfn="create a group">
                    <MdOutlineGroupAdd></MdOutlineGroupAdd>
                </div>
                <div className="menu_icons" dfn="setting">
                    <IoSettingsOutline  ></IoSettingsOutline  >
                </div>
            </div>
            <div className="br"></div>
            <div className="lower">
                <div className="menu_icons" dfn="profile">
                        <IoPersonOutline  ></IoPersonOutline  >
                </div>
                <p id='version' > v.1.0.0</p>
            </div>
        </div>
    </>
}

export default Menu ;