import Menu from  './component/Menu' 
import ResizableContainer from './Resizable_conatiner'


function MainContainer({username,socket}){
    return <>
    
    <div className="main_container">
        <Menu></Menu>    
        <ResizableContainer username={username} socket={socket}></ResizableContainer>
    </div></>
}

export default MainContainer;