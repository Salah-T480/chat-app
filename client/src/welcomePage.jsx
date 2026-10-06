import {  useState } from "react";

function Welecome({socket,error}){
    const [input,setInput] = useState(''); 
    function sendUserName(){
        socket.emit('set username',input) ;
    }
    console.log(error);
    return<>
        <div className="welecome">
            <input type="text" id="welecomeInput" onKeyDown={e=>e.key==='Enter' && sendUserName() }  value= {input}  onChange={(e)=>{ setInput(e.target.value)}}/>
            <button id="joinBtn" onClick={ sendUserName } >Join</button>
            {error && <p id="error">{error}</p>}
        </div>
    </>
}


export default Welecome ;