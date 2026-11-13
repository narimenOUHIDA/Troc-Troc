export async function loginUser(email, password) {
    const url = "http://localhost:3000/auth/login";

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.message}`);
    }

    return response.json();
}

export async function authUser() {
    const token = localStorage.getItem("token");
    const url = "http://localhost:3000/auth/me";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return response.json();
}

export async function registerUser(userData) {
    const response = await fetch(
        "http://localhost:3000/api/v1/auth/register/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
    );

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error("Cette adresse e-mail est déjà utilisée.");
        }

        if (response.status === 400) {
            throw new Error(
                "Données invalides ou code postal non pris en charge."
            );
        }

        throw new Error("Une erreur est survenue. Réessaie.");
    }

    return response.json();
}