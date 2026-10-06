import { useEffect, useState} from 'react'
import './App.css'
import io from 'socket.io-client'
import Chat from './prototype'
import './chat.css'
import Welecome from './welcomePage' 
import MainContainer from './Main_container' 

const socket = io('http://localhost:5000');

function App() {
	const [isValid , setIsValid] = useState(false) ;
	const [username,setUserName] = useState('') ;
	const [error,setError] = useState('');
	const isPrototype = false ;
    
	useEffect(()=>{

		socket.on('invalid username',(msg)=>{
            setError(msg);
        })
		socket.on('valid',(username)=>{
			setIsValid(true);
			setUserName(username);
		})
		return()=>{
			socket.off('valid');
			socket.off('invalid username');
		}


	},[socket]);
  	return<>
	{
		!isValid ? <Welecome socket={socket} error={error} ></Welecome>  : 
		isPrototype?
		<Chat socket={socket} history={history}  username = {username}></Chat>
		:
		<MainContainer username={username} socket={socket}  ></MainContainer>
	}
	
	</>
}

export default App
