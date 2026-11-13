import { useQuery } from '@tanstack/react-query';
import { getListings } from '../api/listings';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/getImageUrl';

import ListingCard from '../components/ListingCard';


function LatestListingsSection() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['listings'],
        queryFn: getListings,
    });

    console.log('data :', data);
    console.log('isPending :', isPending);

    return (
        <section className="home-latest home-container">
            <div className="home-section-heading">
                <h2>Dernières annonces</h2>

                {isPending && <p>Chargement des annonces...</p>}

                {isError && <p>Erreur...</p>}

                <Link to="/annonces" className="home-see-all">
                    Voir tout <span aria-hidden="true">→</span>
                </Link>
            </div>
            <div className="home-listings-grid">
                {data?.length === 0 &&
                    <p>Aucune annonce disponible pour le moment</p>
                }

                {!isPending && !isError &&
                    data?.slice(0, 4).map((listing) => (
                        <ListingCard
                            key={listing.id}
                            id={listing.id}
                            imageUrl={getImageUrl(listing.photos?.[0]?.url)}
                            title={listing.title}
                            price={listing.price}
                        />
                    ))}
            </div>
        </section>

    );
}

export default LatestListingsSection;