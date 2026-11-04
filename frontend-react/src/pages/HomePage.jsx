
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import listings from '../data/listings';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './HomePage.css';

const categories = [
    { name: 'Meubles', icon: '▢' },
    { name: 'Vélos', icon: '♧' },
    { name: 'Vêtements', icon: '♙' },
    { name: 'Électroménager', icon: '▣' },
    { name: 'Livres', icon: '▤' },
    { name: 'Jouets', icon: '⊕' },
];

function HomePage() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    function handleSearch() {
        navigate(`/annonces?q=${encodeURIComponent(query)}`);
    }

    return (
        <>
            <Header />

            <main className="home-page">

                {/* Bannière principale */}
                <section className="home-hero">
                    <div className="home-container home-hero-content">
                        <div className="home-hero-text">
                            <h1>
                                Donnez une seconde vie
                                <br />
                                à vos objets, près de chez vous.
                            </h1>

                            <p>
                                Achetez, vendez et échangez entre particuliers
                                <br />
                                dans un rayon de 50 km autour de chez vous.
                            </p>

                            <div className="home-search">
                                <SearchBar
                                    query={query}
                                    setQuery={setQuery}
                                    onClick={handleSearch}
                                />
                            </div>
                        </div>

                        <div className="home-hero-decoration" aria-hidden="true">
                            <span className="hero-circle hero-circle-large" />
                            <span className="hero-circle hero-circle-small" />
                        </div>
                    </div>
                </section>

                {/* Catégories */}
                <section className="home-categories home-container">
                    <h2>Explorer par catégorie</h2>

                    <div className="home-categories-grid">
                        {categories.map((category) => (
                            <div
                                className="home-category-card"
                                key={category.name}
                            >
                                <div className="home-category-icon">
                                    {category.icon}
                                </div>

                                <h3>{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dernières annonces */}
                <section className="home-latest home-container">
                    <div className="home-section-heading">
                        <h2>Dernières annonces</h2>

                        <Link to="/annonces" className="home-see-all">
                            Voir tout <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="home-listings-grid">
                        {listings.slice(0, 4).map((listing) => (
                            <ListingCard
                                key={listing.id}
                                {...listing}
                            />
                        ))}
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default HomePage;
