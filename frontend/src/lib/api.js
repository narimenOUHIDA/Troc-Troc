// export par défaut d'une fonction asynchrone qui s'appelle api
// cette fonction attend au plus 3 arguments : un endpoint ; une méthode (valeur par défaut GET) ; un body
export default async function api(endpoint, method = "GET", body) {

	const token = localStorage.getItem("token");

	const headers = {
		"Content-Type": "application/json",
	};

	//on ajoute Authorization seulement si token existe
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(
		// URL de la requête : VITE_API_URL provient du .env --> http://localhost:3000 ; concaténé avec le premier argument de la fonction
		// exemple http://localhost:3000/annonces
		`${import.meta.env.VITE_API_URL}${endpoint}`,
		{
			method, // deuxième argument de la fonction : GET / POST / PATCH / PUT / DELETE
			headers,
			body: body ? JSON.stringify(body) : undefined,
		});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
	}

	// récupère le body de la réponse avec response.json()
	const data = await response.json();


	// retourne le body de la réponse (de l'API)
	return data;
}