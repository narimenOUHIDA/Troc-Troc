import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from 'react';

import listings from "../data/listings";
import Header from '../components/Header';
import Footer from '../components/Footer';
import "./ListingDetailPage.css";


function ListingDetailPage() {

    let { id } = useParams();

    const [isFavorite, setIsFavorite] = useState(false);

    const listing = listings.find((listing) => listing.id === Number(id));

    if (!listing) {
        return <p>Annonce introuvable</p>;
    }

    const { title, city, imageUrl, price, Description } = listing;


    return (

        <>
            <Header />
            <main className="listing-detail-page">
                <nav className="detail-breadcrumb">
                    <Link to="/">Accueil</Link>
                    <span>/</span>
                    <Link to="/annonces">Annonces</Link>
                    <span>/</span>
                    <strong>Détail de l'annonce</strong>
                </nav>

                <div className="detail-layout">
                    <section className="detail-content">
                        <div className="detail-gallery">
                            <div className="detail-main-image">
                                <span className="detail-category">Meubles</span>

                                <div className="detail-image-actions">
                                    <button type="button" aria-label="Partager">
                                        ↗
                                    </button>
                                    <button className="favoris" type="button" aria-label="Ajouter aux favoris" onClick={() => setIsFavorite(!isFavorite)}>
                                        {isFavorite ? '❤️' : '♡'}
                                    </button>
                                </div>

                                <div className="detail-image-placeholder">
                                    <img src={imageUrl}></img>
                                </div>

                                <span className="detail-image-counter">1 / 6</span>
                            </div>

                            <div className="detail-thumbnails">
                                {Array.from({ length: 6 }, (_, index) => (
                                    <button
                                        type="button"
                                        className={index === 0 ? "thumbnail active" : "thumbnail"}
                                        key={index}
                                    >
                                        <span>Photo {index + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="detail-heading">
                            <h1>{title}</h1>
                            <p className="detail-meta">
                                Publié il y a 2 jours · Réf. #TT-48213
                            </p>
                            <p className="detail-price">{price}€</p>

                            <div className="detail-tags">
                                <span>✓ Bon état</span>
                                <span>✓ Livraison possible</span>
                            </div>
                        </div>

                        <section className="detail-section">
                            <h2>Description</h2>
                            <p>
                                {Description}
                            </p>
                        </section>

                        <section className="detail-section">
                            <h2>Détails de l'annonce</h2>

                            <dl className="detail-specifications">
                                <dt>Catégorie</dt>
                                <dd>Meubles</dd>

                                <dt>État</dt>
                                <dd>Bon état</dd>

                                <dt>Livraison</dt>
                                <dd>À convenir avec le vendeur</dd>

                                <dt>Localisation</dt>
                                <dd>{city}</dd>
                            </dl>
                        </section>
                    </section>

                    <aside className="detail-sidebar">
                        <div className="seller-card">
                            <div className="seller-profile">
                                <div className="seller-avatar">JD</div>

                                <div>
                                    <h2>Julie D.</h2>
                                    <p>Membre depuis mars 2024</p>
                                </div>
                            </div>

                            <div className="seller-stats">
                                <strong>12</strong>
                                <span>Annonces actives</span>
                            </div>

                            <p className="seller-location">⌖ Lyon 3e</p>
                        </div>

                        <div className="seller-actions">
                            <button type="button" className="contact-button">
                                Contacter le vendeur
                            </button>

                            <button type="button" className="email-button">
                                Envoyer un e-mail
                            </button>

                            <p className="contact-hint">
                                Vous pourrez contacter le vendeur depuis cette page.
                            </p>
                        </div>

                        <div className="safety-card">
                            <h3>⚠ Conseils de sécurité</h3>
                            <p>
                                Privilégiez une remise en main propre dans un lieu public
                                et ne payez jamais avant d'avoir vu l'article.
                            </p>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default ListingDetailPage;