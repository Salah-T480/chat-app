import { useState } from 'react';
import ContactCard from './Contact_card';
import Filter from './Filter';


function ContactNav({width,hundleSelected,contacts,lastMessagesAndEvents}){
    console.log("[ContactNav] : lastMessagesAndEvents ",lastMessagesAndEvents);
    const [filterBy , setFilterBy] = useState("");
    console.log("filterBy",filterBy);
    let body ;
    if( lastMessagesAndEvents.length === 0 ){
        body = " ";
    }
    else if(filterBy === "") {
        body = lastMessagesAndEvents.map((lastMapObj,i) => <ContactCard lastMapObj ={lastMapObj} key={i} onSelect = {hundleSelected} >  </ContactCard>  ) ;
    }
    else{
        const filted = lastMessagesAndEvents.filter(lastMapObj=> lastMapObj.get("roomName").toLowerCase().includes( filterBy.toLowerCase() )) ;
        body = filted.map((lastMapObj,i) => <ContactCard lastMapObj ={lastMapObj} key={i} onSelect = {hundleSelected} >  </ContactCard>  ) ;
    }
    console.log(body);
    return<>
        <div className="contact_nav" style={{width:`${width}px`}}>
            <Filter filterBy ={filterBy} setFilterBy={setFilterBy} ></Filter>
            <div className="contact_cards_container">
                {body}
            </div>
        </div>
    </>
}


export default ContactNav ;
