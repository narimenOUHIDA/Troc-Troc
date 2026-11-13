export async function getCategories() {
    const url = "http://localhost:3000/api/v1/categories";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Status de réponse: ${response.status}`);
    }

    const result = await response.json();
    return result;
}