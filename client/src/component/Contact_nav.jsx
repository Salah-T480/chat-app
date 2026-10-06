import ContactCard from './Contact_card';
import Filter from './Filter';


function ContactNav({width}){
    return<>
        <div className="contact_nav" style={{width:`${width}px`}}>
            <Filter></Filter>
            <div className="contact_cards_container">
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
                <ContactCard></ContactCard>
            </div>
        </div>
    </>
}


export default ContactNav ;
