
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HowItWorksPage.css';

function HowItWorksPage() {
    return (
        <>
            <Header />

            <main className="how-page">

                {/* Bannière */}
                <section className="how-hero">
                    <div className="how-container">
                        <span className="how-eyebrow">
                            SIMPLE, LOCAL ET RESPONSABLE
                        </span>

                        <h1>Comment ça marche ?</h1>

                        <p>
                            Donnez une seconde vie aux objets près de chez vous.
                            Découvrez comment acheter, vendre et échanger
                            facilement avec TrocTroc.
                        </p>
                    </div>
                </section>

                {/* Les étapes */}
                <section className="how-section how-container">
                    <div className="how-section-title">
                        <span>EN 3 ÉTAPES</span>
                        <h2>C'est simple comme bonjour !</h2>
                        <p>
                            Quelques étapes suffisent pour commencer
                            à utiliser TrocTroc.
                        </p>
                    </div>

                    <div className="how-steps">
                        <article className="how-step-card">
                            <span className="how-step-number">01</span>
                            <div className="how-step-icon">⌕</div>
                            <h3>Explorez les annonces</h3>
                            <p>
                                Recherchez des objets parmi les annonces
                                disponibles et découvrez les offres
                                près de chez vous.
                            </p>
                        </article>

                        <article className="how-step-card">
                            <span className="how-step-number">02</span>
                            <div className="how-step-icon">♡</div>
                            <h3>Trouvez votre bonheur</h3>
                            <p>
                                Consultez les photos, le prix et la description
                                des objets qui vous intéressent.
                            </p>
                        </article>

                        <article className="how-step-card">
                            <span className="how-step-number">03</span>
                            <div className="how-step-icon">↔</div>
                            <h3>Contactez le vendeur</h3>
                            <p>
                                Échangez avec le vendeur pour convenir
                                des modalités de récupération de l'objet.
                            </p>
                        </article>
                    </div>
                </section>

                {/* Acheter et vendre */}
                <section className="how-section how-container">
                    <div className="how-section-title">
                        <span>À CHACUN SA FAÇON DE PARTICIPER</span>
                        <h2>Acheter ou vendre sur TrocTroc</h2>
                    </div>

                    <div className="how-options">
                        <article className="how-option-card">
                            <div className="how-option-icon">⌕</div>
                            <h3>Vous cherchez un objet ?</h3>
                            <p>
                                Parcourez les annonces, utilisez les filtres
                                pour affiner votre recherche et trouvez
                                des objets à proximité.
                            </p>

                            <Link to="/annonces" className="how-button how-button-green">
                                Explorer les annonces
                            </Link>
                        </article>

                        <article className="how-option-card">
                            <div className="how-option-icon">＋</div>
                            <h3>Vous souhaitez vendre ?</h3>
                            <p>
                                Créez un compte, préparez les informations
                                de votre objet, ajoutez des photos et
                                publiez votre annonce.
                            </p>

                            <Link to="/inscription" className="how-button how-button-outline">
                                Créer un compte
                            </Link>
                        </article>
                    </div>
                </section>

                {/* Sécurité */}
                <section className="how-section how-container">
                    <div className="how-safety">
                        <div className="how-safety-icon">✓</div>

                        <div>
                            <h2>Quelques conseils pour échanger sereinement</h2>

                            <p>
                                Privilégiez les échanges dans un lieu public,
                                vérifiez l'état de l'objet avant de conclure
                                et ne communiquez jamais vos informations
                                bancaires ou vos mots de passe.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Appel à l'action */}
                <section className="how-cta">
                    <div className="how-container">
                        <h2>Prêt à donner une seconde vie aux objets ?</h2>
                        <p>
                            Découvrez les annonces disponibles sur TrocTroc.
                        </p>

                        <Link to="/annonces" className="how-button how-button-light">
                            Découvrir les annonces →
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default HowItWorksPage;
