import { useState } from "react";
import ClothingFigure from "./ClothingFigure";
import searchIcon from "../assets/images/search.png";
export default function ClosetSearch({clothes, searchRef}) {
const [searchResult, setSearchResult] = useState(null);
const [query, setQuery] = useState('');
function findClothes(query) {
    console.log(query);
    query = query.trim();
    setSearchResult(
        clothes.filter((cl) => {
            return (
                cl.name.toLowerCase().includes(query.toLowerCase()) ||
                cl.type.toLowerCase().includes(query.toLowerCase()) ||
                cl.temperatures.filter(t =>{
                    return t.includes(query.toLowerCase()) 
                }).length>0
            );
        })
    );
}
    return (
        <div className="search-container" ref={searchRef} hidden>
				<form className="search-form" onSubmit={(e)=>{
                    e.preventDefault();
                    findClothes(query);
                    setQuery('');
                    
                }}>
					<input
						type="search"
						className="search-input"
                        name="search"
                        value={query}
                        onChange={(e)=>setQuery(e.target.value)}
						placeholder="Enter search query (name/type/temperature)"
					/>
					<button type="submit" className="button search-btn">
                        <img src={searchIcon} alt="search button" />
                    </button>
                    <button type="reset" className="button clear-btn" onClick={(e)=>{
                    //e.preventDefault();
                    setQuery('');
                    setSearchResult(null)
                    
                    
                }}>Clear</button>
				</form>
				<div className="search-results">
					{searchResult &&(
                        searchResult.length>0 ?
                    searchResult.map(res => <ClothingFigure key={res.id} data={res}/>)
                    :
                    <p className="no-matches-found">No matches found</p>)}
				</div>
			</div>
    )
}