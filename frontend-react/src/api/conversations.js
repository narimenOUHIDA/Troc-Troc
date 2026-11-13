export async function createConversation(listingId) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/api/v1/conversations",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ listingId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return response.json();
}

export async function getConversationById(id) {
    const token = localStorage.getItem("token");

    const url = `http://localhost:3000/api/v1/conversations/${id}`;

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`Status de réponse: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
}

export async function createMessage(id, content) {
    const token = localStorage.getItem("token");

    const url = `http://localhost:3000/api/v1/conversations/${id}/messages`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error("Impossible d'envoyer le message.");
    }

    const result = await response.json();
    return result.data;
}

export async function getConversations() {
    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:3000/api/v1/conversations",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const result = await response.json();

    return result.data;
}