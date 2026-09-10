
const API_URL = import.meta.env.VITE_API_URL;

export default async function apiPhoto(listingId, file, order) {
    const formData = new FormData();

    formData.append('uploaded_file', file);
    formData.append('listingId', listingId);
    formData.append('order', order);

    const response = await fetch(
        `${API_URL}/photos`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to upload photo: ${response.statusText}`);
    }

    return await response.json();
}

export function urlPhoto(path) {
    if (!path) return '';

    // Si l'API renvoie déjà une URL complète
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Supprime "uploads/" au début si nécessaire
    const cleanPath = path.replace(/^\/+/, '');

    return `${API_URL}/${cleanPath}`;
}

