const API_URL = import.meta.env.VITE_API_URL;

export function getImageUrl(photoUrl) {

    if (!photoUrl) {
        return "/placeholder.png";
    }

    return `${API_URL}/${photoUrl}`
}