
import { useRef ,useEffect} from "react"


export default function RoomOptions({hundleOnClear,hundleOnShowMoreInfo,toShow,setShowOp}){
    const option_container= useRef(null);
    useEffect(()=>{
        function hundleHiddeOptions(e){
            if(  option_container.current && !option_container.current.contains(e.target) ) {setShowOp(false) ;
            }
        }


        window.addEventListener('click',hundleHiddeOptions);
        return ()=>{
        window.removeEventListener('click',hundleHiddeOptions);

        }
    })
    if(!toShow) return null ;
    return<>
        <ul className='options_container' ref={option_container} onClick={e=> e.stopPropagation() } >
            <li onClick={hundleOnClear}>clear chat</li>
            <li onClick={hundleOnShowMoreInfo} >more info </li>
            <li>leave</li>
        </ul>
    </>
}