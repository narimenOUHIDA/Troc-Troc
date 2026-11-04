import { useState } from "react";
import { Link } from "react-router-dom";

function ListingCard({ id, title, price, city, imageUrl }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(price);

    return (
        <article className="listing-card">
            <div className="blocImg">
                <img src={imageUrl} alt={title} />
                <button className="favoris" onClick={() => setIsFavorite(!isFavorite)}>
                    {isFavorite ? '❤️' : '♡'}
                </button>
            </div>
            <Link to={`/annonces/${id}`}><h2>{title}</h2> </Link>
            <p>{formattedPrice}</p>
            <p>{city}</p>
        </article>
    );
}

export default ListingCard;