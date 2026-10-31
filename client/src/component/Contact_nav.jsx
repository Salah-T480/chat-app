import ContactCard from './Contact_card';
import Filter from './Filter';


function ContactNav({width,hundleSelected,contacts,lastMessagesAndEvents}){
    console.log("[ContactNav] : lastMessagesAndEvents ",lastMessagesAndEvents);
    let body ;
    if( lastMessagesAndEvents.length === 0 ){
        body = " ";
    }
    else{
        body = lastMessagesAndEvents.map((lastMapObj,i) => <ContactCard lastMapObj ={lastMapObj} key={i} onSelect = {hundleSelected} >  </ContactCard>  ) ;
    }
    console.log(body);
    return<>
        <div className="contact_nav" style={{width:`${width}px`}}>
            <Filter></Filter>
            <div className="contact_cards_container">
                {body}
            </div>
        </div>
    </>
}


export default ContactNav ;
