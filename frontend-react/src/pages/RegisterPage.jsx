
import { Link } from "react-router-dom";
import "../styles/auth.css";

function RegisterPage() {
    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-brand">
                    Troc <span>Troc</span>
                </div>

                <div className="auth-heading">
                    <h1>Créer un compte</h1>
                    <p>Rejoignez la communauté Troc Troc</p>
                </div>

                <form className="auth-form">
                    <div className="auth-name-fields">
                        <div className="auth-field">
                            <label htmlFor="register-firstname">Prénom</label>
                            <input
                                id="register-firstname"
                                name="firstName"
                                type="text"
                                placeholder="Marie"
                                autoComplete="given-name"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-lastname">Nom</label>
                            <input
                                id="register-lastname"
                                name="lastName"
                                type="text"
                                placeholder="Curie"
                                autoComplete="family-name"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-email">Adresse e-mail</label>
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="marie.curie@mail.fr"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-postalcode">Code postal</label>
                        <input
                            id="register-postalcode"
                            name="postalCode"
                            type="text"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            placeholder="69001"
                            maxLength={5}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-password">Mot de passe</label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-confirm">Confirmer le mot de passe</label>
                        <input
                            id="register-confirm"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                        />
                        {/* Zone réservée à l'erreur de confirmation */}
                    </div>

                    <label className="auth-checkbox auth-terms">
                        <input type="checkbox" name="acceptTerms" required />
                        <span>
                            J'accepte les <a href="#cgu">CGU</a> et la
                            <a href="#confidentialite"> politique de confidentialité</a>
                        </span>
                    </label>

                    <button type="submit" className="auth-submit">
                        Créer mon compte
                    </button>
                </form>

                <p className="auth-switch">
                    Déjà un compte ?
                    <Link to="/connexion">Se connecter</Link>
                </p>
            </section>
        </main>
    );
}

export default RegisterPage;
