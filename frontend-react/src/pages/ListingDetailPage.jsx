import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { getListingById } from '../api/listings';
import { useQuery } from '@tanstack/react-query';
import { getImageUrl } from '../utils/getImageUrl';
import { getInitials } from '../utils/getInitials';
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createConversation } from "../api/conversations";

import Header from '../components/Header';
import Footer from '../components/Footer';

import "./ListingDetailPage.css";

function ListingDetailPage() {

    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    const { id } = useParams();

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: createConversation,
        onSuccess: (result) => {
            const conversation = result.data;
            navigate(`/messagerie/${conversation.id}`);
        },
    });

    const { data: listing, isPending: isPendingListing, isError: isErrorListing, error } = useQuery({
        queryKey: ['listingDetails', id],
        queryFn: () => getListingById(id),
    });

    if (isPendingListing) {
        return <p>Chargement de l'annonce...</p>;
    }

    if (isErrorListing) {
        return <p>Erreur : {error.message}</p>;
    }

    if (!listing) {
        return <p>Annonce introuvable</p>;
    }


    const { category, photos, title, description, price, user, status, publicationDate } = listing;



    const date = new Date(publicationDate).toLocaleDateString('fr-FR')

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
                                <span className="detail-category">{category.name}</span>

                                <div className="detail-image-actions">
                                    <button type="button" aria-label="Partager">
                                        ↗
                                    </button>
                                    <button className="favoris" type="button" aria-label="Ajouter aux favoris" onClick={() => setIsFavorite(!isFavorite)}>
                                        {isFavorite ? '❤️' : '♡'}
                                    </button>
                                </div>

                                <div className="detail-image-placeholder">
                                    <img src={getImageUrl(photos?.[selectedPhotoIndex]?.url)} alt={title}></img>
                                </div>
                                {photos.length > 0 &&
                                    <span className="detail-image-counter">{selectedPhotoIndex + 1} / {photos.length}</span>
                                }

                            </div>

                            <div className="detail-thumbnails">
                                {photos.map((photo, index) => (
                                    <button
                                        type="button"
                                        className={index === selectedPhotoIndex ? "thumbnail active" : "thumbnail"}
                                        key={photo.id}
                                        onClick={() => setSelectedPhotoIndex(index)}
                                    >
                                        <img
                                            src={getImageUrl(photo.url)}
                                            alt={`Photo ${index + 1} de ${title}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="detail-heading">
                            <h1>{title}</h1>
                            <p className="detail-meta">
                                Publié le {date}
                            </p>
                            <p className="detail-price">{price}€</p>

                            <div className="detail-tags">
                                <span>✓ Bon état</span>
                                <span>✓ Livraison possible</span>
                            </div>
                        </div>

                        <section className="detail-section">
                            <h2>Description</h2>
                            <p>{description}</p>
                        </section>

                        <section className="detail-section">
                            <h2>Détails de l'annonce</h2>

                            <dl className="detail-specifications">
                                <dt>Catégorie</dt>
                                <dd>{category.name}</dd>

                                <dt>Statu</dt>
                                <dd>{status.name}</dd>

                                <dt>Localisation</dt>
                                <dd>{user.PostalCode.city}</dd>
                            </dl>
                        </section>
                    </section>

                    <aside className="detail-sidebar">
                        <div className="seller-card">
                            <div className="seller-profile">
                                <div className="seller-avatar">
                                    {getInitials(user.firstName, user.lastName)}
                                </div>

                                <div>
                                    <h2 color='red'>{(user.firstName).toUpperCase()}</h2>
                                </div>
                            </div>


                            <p className="seller-location">{user.PostalCode.city}</p>
                        </div>

                        <div className="seller-actions">
                            <button
                                type="button"
                                className="contact-button"
                                disabled={isPending}
                                onClick={() => mutate(listing.id)}
                            >
                                {isPending ? "Chargement..." : "Contacter le vendeur"}
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