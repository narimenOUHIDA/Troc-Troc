// export par défaut d'une fonction asynchrone qui s'appelle api
// cette fonction attend au plus 3 arguments : un endpoint ; une méthode (valeur par défaut GET) ; un body
export default async function api(endpoint, method = "GET", body) {
	// fonction JS qui permet de créer des requetes HTTP et de les envoyer
	// response contient la réponse de l'API à la requête qui sera envoyée
	const response = await fetch(
		// URL de la requête : VITE_API_URL provient du .env --> http://localhost:3000 ; concaténé avec le premier argument de la fonction
		// exemple http://localhost:3000/lists
		`${import.meta.env.VITE_API_URL}${endpoint}`,
		{ // entêtes de la requête
			method, // deuxième argument de la fonction : GET / POST / PATCH / PUT / DELETE
			headers: {
				"Content-Type": "application/json", // protocle HTTP : annonce que le body est du JSON
				Authorization: `Bearer ${localStorage.getItem("token")}`, // ajoute le token dans l'entête de la requête
			},
			body: JSON.stringify(body), // body de la requête, troisème argument de la fonction api
		});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
	}

	// récupère le body de la réponse avec response.json()
	const data = await response.json();

	// retourne le body de la réponse (de l'API)
	return data;
}