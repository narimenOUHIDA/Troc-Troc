
import { Link, NavLink } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import './Header.css';

function Header() {
    return (
        <header className="site-header">
            <div className="header-container">

                <Link to="/" className="header-logo">
                    Troc <span>Troc</span>
                </Link>

                <nav className="header-nav" aria-label="Navigation principale">
                    <NavLink to="/" end>
                        Accueil
                    </NavLink>

                    <NavLink to="/comment-ca-marche">
                        Comment ça marche
                    </NavLink>
                </nav>

                <div className="header-actions">
                    <Link to="/deposer-annonce" className="header-post-button">
                        + Déposer une annonce
                    </Link>

                    <Link
                        to="/connexion"
                        className="header-account"
                        aria-label="Connexion à mon compte"
                    >
                        <span className="header-account-icon">
                            <UserRound size={20} strokeWidth={1.8} />
                        </span>                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;
