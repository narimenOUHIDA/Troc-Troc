
import { Link, NavLink } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from "react"
import './Header.css';

function Header() {

    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

                    {user ?
                        <div className="header-user-menu">
                            <button
                                type="button"
                                className="header-account"
                                aria-label="Ouvrir le menu du compte"
                                aria-expanded={isMenuOpen}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="header-account-icon">
                                    <UserRound size={20} strokeWidth={1.8} />
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="header-dropdown">
                                    <Link
                                        to="/mon-compte"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Mon compte
                                    </Link>

                                    <button type="button" onClick={logout}>
                                        Se déconnecter
                                    </button>
                                </div>
                            )}
                        </div>
                        :
                        <div className="header-auth-actions">
                            <Link to="/connexion" className="header-login">
                                Se connecter
                            </Link>

                            <Link to="/inscription" className="header-register">
                                S'inscrire
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </header>
    );
}

export default Header;
