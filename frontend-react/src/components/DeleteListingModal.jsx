
import { Trash2 } from 'lucide-react';

function DeleteListingModal({ listingTitle }) {
    return (
        <div className="profile-modal-overlay">
            <div
                className="profile-delete-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-modal-title"
            >
                <div className="profile-modal-icon">
                    <Trash2 size={25} strokeWidth={1.8} />
                </div>

                <h2 id="delete-modal-title">
                    Supprimer cette annonce ?
                </h2>

                <p>
                    Cette action est irréversible. L'annonce
                    <br />
                    « {listingTitle} » sera définitivement supprimée.
                </p>

                <div className="profile-modal-actions">
                    <button
                        type="button"
                        className="profile-modal-cancel"
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        className="profile-modal-confirm"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteListingModal;
