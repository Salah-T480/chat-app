function MessageCard({sender,time,message,username } ){
    const formatTime = new Date(time).toLocaleTimeString('en-GB', {  hour: '2-digit',  minute: '2-digit' });
    const selectedClass = "outer_message_card "+(sender===username ? 'to_right': 'to_left');
    
    return <>
    <div className={selectedClass}>
        <div className="message_profile" >
            <img src="/src/assets/vite.svg" alt="" />
        </div>
        <div className="message_card">
            <div id="sender_name" > {sender} </div>
            <div id="message_content" > {message} </div>   
            <div id="time_sent"> {formatTime} </div> 
        </div>
    </div></>
}



export default MessageCard ;