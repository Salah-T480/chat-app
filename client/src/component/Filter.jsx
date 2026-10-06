import {FaSearch} from 'react-icons/fa'



function Filter(){
    return <>
        <div className="filter">
            <input type="text" placeholder='Search' />
            <FaSearch id='search' ></FaSearch>
        </div>
    </>
    
}
export default Filter ;