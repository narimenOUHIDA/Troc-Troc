// Ce fichier a la responsabilité de récupérer les annonces depuis mon back-end

export async function getListings() {
    const url = "http://localhost:3000/api/v1/annonces";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Status de réponse : ${response.status}`);
    }

    const result = await response.json();
    return result.data;

}

export async function getListingById(id) {
    const url = `http://localhost:3000/api/v1/annonces/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Status de réponse: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
}