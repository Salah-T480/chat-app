import { useEffect, useState } from "react";

function Chat({socket,username}){
    const [text ,setText] = useState('');
    const [history,setHistory ] = useState([]);
	useEffect(()=>{
		socket.on('new message',(data)=> setHistory(h=>[...h,data]))
		return ()=>{
			socket.off('new message');
		}
	},[socket])
    const onSend =  ()=>{
        socket.emit('send',text,username) ;
        setText('');
    }
	

    return<>
        <div className="container">
            <div className="display">
                <ul>
                    {history.map((data)=>
                        <li>
                            <p> [{new Date(data.time).toLocaleString().replace(',', ' ')}] [{data.sender}] [{data.message}] </p>
                        </li>
                    )}
                </ul>
            </div>
            <div className="operation">
                <input type="text" name="message" id="messageInput" autoComplete="off"  value={text} onKeyDown={(e)=> e.key === 'Enter' &&  onSend()}   onChange={(e)=>setText(e.target.value)} />
                <button id="sendBtn" onClick={onSend} >send</button>
            </div>
        </div>
    </>
}

export default  Chat;