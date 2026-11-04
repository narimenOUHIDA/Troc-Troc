
import { Link } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';

import './CreateListingPage.css';

function CreateListingPage() {
    return (
        <>
            <Header />

            <main className="create-listing-page">
                <div className="create-listing-container">

                    {/* Fil d'Ariane */}
                    <nav className="create-breadcrumb">
                        <Link to="/">Accueil</Link>
                        <span>/</span>
                        <strong>Déposer une annonce</strong>
                    </nav>

                    {/* Titre */}
                    <div className="create-page-heading">
                        <h1>Déposer une annonce</h1>
                        <p>
                            Renseignez les informations de votre article
                            pour le mettre en ligne.
                        </p>
                    </div>

                    <div className="create-listing-layout">

                        {/* Formulaire */}
                        <section className="create-form-column">
                            <form className="create-listing-form">

                                {/* Photos */}
                                <div className="create-photos-section">
                                    <label className="create-section-label">
                                        Photos <span>*</span>
                                    </label>

                                    <p className="create-help-text">
                                        Ajoutez jusqu'à 6 photos.
                                        La première sera la photo de couverture.
                                    </p>

                                    <div className="create-photos-grid">

                                        {/* Emplacements visuels provisoires */}
                                        <div className="create-photo-item">
                                            <span className="create-cover-badge">
                                                Couverture
                                            </span>
                                            <span className="create-photo-placeholder">
                                                ▧
                                            </span>
                                        </div>

                                        <div className="create-photo-item">
                                            <span className="create-photo-placeholder">
                                                ▧
                                            </span>
                                        </div>

                                        <div className="create-photo-item">
                                            <span className="create-photo-placeholder">
                                                ▧
                                            </span>
                                        </div>

                                        {/* Futur champ d'ajout de photos */}
                                        <label
                                            className="create-photo-add"
                                            htmlFor="listing-photos"
                                        >
                                            <span className="create-add-icon">+</span>
                                            <span>Ajouter</span>
                                        </label>

                                        <input
                                            id="listing-photos"
                                            name="photos"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="create-file-input"
                                        />
                                    </div>
                                </div>

                                {/* Titre */}
                                <div className="create-field">
                                    <label htmlFor="listing-title">
                                        Titre de l'annonce <span>*</span>
                                    </label>

                                    <input
                                        id="listing-title"
                                        name="title"
                                        type="text"
                                        placeholder="Ex. Canapé 3 places en tissu gris"
                                        required
                                    />
                                </div>

                                {/* Catégorie */}
                                <div className="create-field">
                                    <label htmlFor="listing-category">
                                        Catégorie <span>*</span>
                                    </label>

                                    <select
                                        id="listing-category"
                                        name="categoryId"
                                        defaultValue=""
                                        required
                                    >
                                        <option value="" disabled>
                                            Choisir une catégorie
                                        </option>
                                        <option value="meubles">Meubles</option>
                                        <option value="velos">Vélos</option>
                                        <option value="vetements">Vêtements</option>
                                        <option value="electromenager">
                                            Électroménager
                                        </option>
                                        <option value="livres">Livres</option>
                                        <option value="jouets">Jouets</option>
                                    </select>
                                </div>

                                {/* Prix */}
                                <div className="create-field">
                                    <label htmlFor="listing-price">
                                        Prix <span>*</span>
                                    </label>

                                    <div className="create-price-input">
                                        <input
                                            id="listing-price"
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Ex. 120"
                                            required
                                        />
                                        <span>€</span>
                                    </div>

                                    <p className="create-help-text">
                                        Astuce : un prix juste attire plus
                                        rapidement les acheteurs.
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="create-field">
                                    <label htmlFor="listing-description">
                                        Description <span>*</span>
                                    </label>

                                    <textarea
                                        id="listing-description"
                                        name="description"
                                        rows="6"
                                        maxLength={1000}
                                        placeholder="Décrivez votre objet, son état et ses caractéristiques..."
                                        required
                                    />
                                    <span className="create-character-count">
                                        0 / 1000
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="create-form-actions">
                                    <button
                                        type="submit"
                                        className="create-publish-button"
                                    >
                                        Publier l'annonce
                                    </button>

                                    <button
                                        type="button"
                                        className="create-draft-button"
                                    >
                                        Enregistrer comme brouillon
                                    </button>
                                </div>
                            </form>
                        </section>

                        {/* Aperçu de l'annonce */}
                        <aside className="create-preview-column">
                            <div className="create-preview-heading">
                                <h2>Aperçu de l'annonce</h2>
                                <p>
                                    Voici comment votre annonce apparaîtra
                                    aux autres utilisateurs.
                                </p>
                            </div>

                            <article className="create-preview-card">
                                <div className="create-preview-image">
                                    <span className="create-preview-category">
                                        Catégorie
                                    </span>

                                    <span className="create-preview-placeholder">
                                        ▧
                                    </span>
                                </div>

                                <div className="create-preview-info">
                                    <h3>Titre de votre annonce</h3>
                                    <p className="create-preview-price">
                                        0 €
                                    </p>
                                    <p className="create-preview-location">
                                        ⌖ Localisation à renseigner
                                    </p>
                                </div>
                            </article>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default CreateListingPage;
