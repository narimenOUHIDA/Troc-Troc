
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/auth";
import { useState } from "react";

import "../styles/auth.css";

function RegisterPage() {
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");

    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate("/connexion");
        },
    });

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        setPasswordError("");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password !== confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas.");
            return;
        }

        const userData = {
            firstName: formData.get("firstName").trim(),
            lastName: formData.get("lastName").trim(),
            email: formData.get("email").trim(),
            postalCode: formData.get("postalCode").trim(),
            password,
        };

        mutate(userData);
    }

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

                <form className="auth-form" onSubmit={handleSubmit}>
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
                    </div>
                    {passwordError && (
                        <p className="auth-error" role="alert">
                            {passwordError}
                        </p>
                    )}

                    <label className="auth-checkbox auth-terms">
                        <input type="checkbox" name="acceptTerms" required />
                        <span>
                            J'accepte les <a href="#cgu">CGU</a> et la
                            <a href="#confidentialite"> politique de confidentialité</a>
                        </span>
                    </label>

                    {isError && (
                        <p className="auth-error" role="alert">
                            {error.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={isPending}
                    >
                        {isPending ? "Création du compte..." : "Créer mon compte"}
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
