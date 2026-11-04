
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-container">

                <div className="footer-main">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            Troc <span>Troc</span>
                        </Link>

                        <p>
                            Donnons une seconde vie aux objets.
                            Achetez, vendez et échangez près de chez vous.
                        </p>
                    </div>

                    <nav className="footer-links" aria-label="Navigation du pied de page">
                        <Link to="/">Accueil</Link>
                        <Link to="/annonces">Annonces</Link>
                        <Link to="/connexion">Connexion</Link>
                        <Link to="/comment-ca-marche">Comment ça marche</Link>
                    </nav>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 TrocTroc. Tous droits réservés.</p>
                    <span>Fait avec ♡ pour une consommation responsable.</span>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
