
function LogoutModal() {
    return (
        <div className="logout-overlay">
            <div
                className="logout-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-title"
            >
                <div className="logout-icon">↪</div>

                <h2 id="logout-title">Se déconnecter ?</h2>

                <p>
                    Vous devrez vous reconnecter pour accéder
                    à votre espace personnel.
                </p>

                <div className="logout-actions">
                    <button type="button" className="logout-cancel">
                        Annuler
                    </button>

                    <button type="button" className="logout-confirm">
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutModal;
