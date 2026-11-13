
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useMutation } from "@tanstack/react-query";

import "../styles/auth.css";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const { mutate, isError, error } = useMutation({
        mutationFn: ({ email, password }) => loginUser(email, password),
        onSuccess: (result) => {
            login(result);
            navigate("/");
        }
    });


    const handelSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        mutate({ email, password });

    };

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-brand">
                    Troc <span>Troc</span>
                </div>

                <div className="auth-heading">
                    <h1>Bon retour parmi nous</h1>
                    <p>Connectez-vous à votre compte</p>
                </div>

                <form onSubmit={handelSubmit} noValidate className="auth-form">
                    {isError && <p>{error.message}</p>}
                    <div className="auth-field">
                        <label htmlFor="login-email">Adresse e-mail</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="marie.curie@mail.fr"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="login-password">Mot de passe</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
                            placeholder="Votre mot de passe"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="auth-form-options">
                        <label className="auth-checkbox">
                            <input type="checkbox" name="remember" />
                            <span>Se souvenir de moi</span>
                        </label>

                        <a href="#mot-de-passe-oublie">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <button type="submit" className="auth-submit" >
                        Se connecter
                    </button>
                </form>

                <p className="auth-switch">
                    Pas encore de compte ?
                    <Link to="/inscription">S'inscrire</Link>
                </p>
            </section>
        </main>
    );
}

export default LoginPage;
