import {FaSearch} from 'react-icons/fa'



function Filter({filterBy,setFilterBy} ){
    function hundleUserFilter(e){
        setFilterBy(e.target.value) ;
    }
    return <>
        <div className="filter">
            <input type="text" placeholder='Search' value={filterBy} onChange={hundleUserFilter} />
            <FaSearch id='search' ></FaSearch>
        </div>
    </>
    
}
export default Filter ;