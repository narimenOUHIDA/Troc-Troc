
import { Link } from 'react-router-dom';
import {
    Pencil,
    Check,
    Trash2,
    Eye,
    Mail,
    MapPin,
    Image as ImageIcon
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import DeleteListingModal from '../components/DeleteListingModal';

import './ProfilePage.css';

const demoListings = [
    {
        id: 1,
        title: 'Canapé 3 places en tissu gris',
        price: 120,
        status: 'active',
        published: 'Publiée il y a 2 jours',
        views: 84,
        messages: 5,
    },
    {
        id: 2,
        title: 'Vélo enfant 20 pouces',
        price: 45,
        status: 'active',
        published: 'Publiée il y a 5 jours',
        views: 52,
        messages: 2,
    },
    {
        id: 3,
        title: 'Table basse en bois massif',
        price: 60,
        status: 'sold',
        published: 'Vendue il y a 1 jour',
        views: 130,
        messages: 9,
    },
    {
        id: 4,
        title: 'Console de jeux rétro',
        price: 80,
        status: 'draft',
        published: 'Brouillon · non publiée',
        views: 0,
        messages: 0,
    },
];

const statusLabels = {
    active: 'Active',
    sold: 'Vendue',
    draft: 'Brouillon',
};

function ProfilePage() {
    return (
        <>
            <Header />

            <main className="profile-page">
                <div className="profile-container">

                    {/* Profil utilisateur */}
                    <section className="profile-header">
                        <div className="profile-user">
                            <div className="profile-avatar">MC</div>

                            <div className="profile-user-info">
                                <h1>Marie Curie</h1>
                                <p>
                                    Membre depuis mars 2024 · Lyon (69001)
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/deposer-annonce"
                            className="profile-create-button"
                        >
                            + Déposer une annonce
                        </Link>
                    </section>

                    {/* Navigation de l'espace personnel */}
                    <nav className="profile-tabs">
                        <span className="profile-tab active">
                            Mes annonces
                        </span>
                        <span className="profile-tab">
                            Mes informations
                        </span>
                        <span className="profile-tab">
                            Messagerie
                        </span>
                    </nav>

                    {/* Statistiques */}
                    <section className="profile-stats">
                        <article className="profile-stat-card">
                            <strong>8</strong>
                            <span>Annonces actives</span>
                        </article>

                        <article className="profile-stat-card">
                            <strong>5</strong>
                            <span>Annonces vendues</span>
                        </article>

                        <article className="profile-stat-card">
                            <strong>142</strong>
                            <span>Vues ce mois-ci</span>
                        </article>
                    </section>

                    {/* Filtres des annonces */}
                    <div className="profile-filters">
                        <button className="profile-filter active" type="button">
                            Toutes (13)
                        </button>

                        <button className="profile-filter" type="button">
                            Actives (8)
                        </button>

                        <button className="profile-filter" type="button">
                            Vendues (5)
                        </button>

                        <button className="profile-filter" type="button">
                            Brouillons (0)
                        </button>
                    </div>

                    {/* Liste des annonces */}
                    <section className="profile-listings">
                        {demoListings.map((listing) => (
                            <article
                                className="profile-listing-card"
                                key={listing.id}
                            >
                                <div className="profile-listing-image">
                                    <ImageIcon size={34} strokeWidth={1.2} />
                                </div>

                                <div className="profile-listing-details">
                                    <h2>{listing.title}</h2>

                                    <div className="profile-listing-meta">
                                        <span
                                            className={`profile-status profile-status-${listing.status}`}
                                        >
                                            {statusLabels[listing.status]}
                                        </span>

                                        <span>{listing.published}</span>
                                    </div>

                                    <div className="profile-listing-bottom">
                                        <strong>{listing.price} €</strong>

                                        <span className="profile-listing-views">
                                            <Eye size={16} />
                                            {listing.views} vues
                                        </span>

                                        <span className="profile-listing-messages">
                                            <Mail size={16} />
                                            {listing.messages} messages
                                        </span>
                                    </div>
                                </div>

                                {/* Actions visuelles uniquement */}
                                <div className="profile-listing-actions">
                                    <button
                                        type="button"
                                        className="profile-icon-button"
                                        aria-label="Modifier l'annonce"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    {listing.status === 'active' && (
                                        <button
                                            type="button"
                                            className="profile-icon-button profile-sold-button"
                                            aria-label="Marquer comme vendue"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}

                                    {listing.status === 'sold' && (
                                        <button
                                            type="button"
                                            className="profile-relist-button"
                                        >
                                            Remettre en vente
                                        </button>
                                    )}

                                    {listing.status === 'draft' && (
                                        <button
                                            type="button"
                                            className="profile-publish-button"
                                        >
                                            Publier
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="profile-icon-button profile-delete-button"
                                        aria-label="Supprimer l'annonce"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}

export default ProfilePage;
