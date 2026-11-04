
function SearchBar({ query, setQuery, onClick }) {

    function handelSubmit(event) {
        event.preventDefault();
        onClick();
    }

    return (
        <div>
            <form onSubmit={handelSubmit}>
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Recherche une annonce..."
                    aria-label="Rechercher une annonce"
                />
                <button type="submit" >Rechercher</button>
            </form>
        </div>
    )
}

export default SearchBar;