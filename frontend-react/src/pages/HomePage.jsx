
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CategoriesSection from '../components/CategoriesSection';
import LatestListingsSection from '../components/LatestListingsSection';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css';

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
                <CategoriesSection />

                {/* Dernières annonces */}
                <LatestListingsSection />

            </main>

            <Footer />
        </>
    );
}

export default HomePage;
