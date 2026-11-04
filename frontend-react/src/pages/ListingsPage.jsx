
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Header from '../components/Header';
import ListingCard from '../components/ListingCard';
import listings from '../data/listings';
import SearchBar from '../components/SearchBar';

import './ListingsPage.css';

function ListingsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const filteredListings = listings.filter((listing) =>
        listing.title.toLowerCase().includes(query.toLowerCase())
    );

    function handleSearch() {
        setSearchParams(query ? { q: query } : {});
    }

    return (
        <>
            <Header />

            <main className="listings-page">
                <div className="listings-container">

                    {/* En-tête de la page */}
                    <div className="listings-heading">
                        <h1>Toutes les annonces</h1>

                        <p className="listings-location">
                            <span>⌖</span>
                            Annonces autour de Lyon (69001)
                            <button type="button">Modifier</button>
                        </p>
                    </div>

                    {/* Recherche et tri */}
                    <div className="listings-toolbar">
                        <div className="listings-search">
                            <SearchBar
                                query={query}
                                setQuery={setQuery}
                                onClick={handleSearch}
                            />
                        </div>

                        <div className="listings-sort">
                            <label htmlFor="sort-listings">
                                Trier :
                            </label>

                            <select id="sort-listings" defaultValue="recent">
                                <option value="recent">Plus récentes</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                            </select>
                        </div>
                    </div>

                    {/* Filtres actifs : affichage provisoire */}
                    <div className="active-filters">
                        <span className="filter-chip">Meubles ×</span>
                        <span className="filter-chip">Prix : 0–200 € ×</span>

                        <button type="button" className="reset-filters">
                            Réinitialiser les filtres
                        </button>
                    </div>

                    {/* Contenu principal */}
                    <div className="listings-layout">

                        {/* Barre latérale */}
                        <aside className="filters-sidebar">
                            <h2>Filtres</h2>

                            <div className="filter-section">
                                <h3>Catégories</h3>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Meubles</span>
                                </label>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Vélos</span>
                                </label>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Vêtements</span>
                                </label>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Électroménager</span>
                                </label>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Livres</span>
                                </label>

                                <label className="filter-option">
                                    <input type="checkbox" />
                                    <span>Jouets</span>
                                </label>
                            </div>

                            <div className="filter-section">
                                <h3>Prix (€)</h3>

                                <div className="price-fields">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        aria-label="Prix minimum"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Max"
                                        aria-label="Prix maximum"
                                    />
                                </div>
                            </div>

                            <div className="filter-section">
                                <h3>Distance</h3>

                                <input
                                    className="distance-range"
                                    type="range"
                                    min="0"
                                    max="50"
                                    defaultValue="50"
                                />

                                <p className="distance-label">
                                    Rayon fixe : 50 km
                                </p>

                                <p className="filter-help">
                                    Basé sur votre code postal.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="apply-filters"
                            >
                                Filtrer
                            </button>
                        </aside>

                        {/* Annonces */}
                        <section
                            className="listings-results"
                            aria-label="Résultats des annonces"
                        >
                            <div className="listings-grid">
                                {filteredListings.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        {...listing}
                                    />
                                ))}
                            </div>

                            {filteredListings.length === 0 && (
                                <p className="listings-empty">
                                    Aucune annonce trouvée.
                                </p>
                            )}

                            {/* Pagination visuelle */}
                            <nav
                                className="listings-pagination"
                                aria-label="Pagination des annonces"
                            >
                                <button type="button">‹</button>
                                <button
                                    type="button"
                                    className="current-page"
                                    aria-current="page"
                                >
                                    1
                                </button>
                                <button type="button">2</button>
                                <button type="button">3</button>
                                <span>…</span>
                                <button type="button">12</button>
                                <button type="button">›</button>
                            </nav>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

export default ListingsPage;
