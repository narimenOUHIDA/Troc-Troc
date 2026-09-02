// `$env/dynamic/public` (plutôt que `$env/static/public`) permet de changer
// PUBLIC_API_URL sans rebuild (utile en Docker où l'URL de l'API varie selon l'environnement).
import { env } from '$env/dynamic/public';

// URL de base de l'API backend (Express). Fallback sur le port par défaut en dev local
// si la variable d'environnement PUBLIC_API_URL n'est pas définie.
const API_URL = env.PUBLIC_API_URL ?? 'http://localhost:3000';

/**
 * Options acceptées par `request()` et par les helpers `api.get/post/put/patch/delete`.
 *
 * @typedef {object} RequestOptions
 * @property {string} [method] - Verbe HTTP (GET par défaut).
 * @property {unknown} [body] - Sera sérialisé en JSON s'il est présent.
 * @property {Record<string, string>} [headers] - En-têtes additionnels, fusionnés après les en-têtes par défaut.
 * @property {typeof fetch} [fetch] - Pass the `fetch` from a `load` function when calling during SSR
 *   (le `fetch` global de SvelteKit gère les cookies/credentials côté serveur, contrairement au `fetch` natif du navigateur).
 */

/**
 * Erreur levée quand l'API répond avec un status HTTP en erreur (4xx/5xx).
 * Porte le status et le corps de la réponse pour permettre un traitement fin
 * côté appelant (ex: afficher `error.data.message` dans un formulaire).
 */
export class ApiError extends Error {
	/**
	 * @param {string} message
	 * @param {number} status
	 * @param {unknown} data
	 */
	constructor(message, status, data) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

/**
 * Effectue un appel HTTP vers l'API backend et retourne le corps de la réponse
 * déjà parsé (JSON si le Content-Type le permet, sinon texte brut).
 *
 * @param {string} path - Chemin relatif à API_URL, ex: '/annonces'.
 * @param {RequestOptions} [options]
 * @returns {Promise<unknown>}
 * @throws {ApiError} si la réponse HTTP n'est pas ok (status hors 200-299).
 */
async function request(path, { method = 'GET', body, headers = {}, fetch: fetchFn = fetch } = {}) {
	console.log(`[api] ${method} ${path}`, body ?? '');

	const response = await fetchFn(`${API_URL}${path}`, {
		method,
		// Envoie/reçoit le cookie de session (JWT) requis par le backend pour l'authentification.
		credentials: 'include',
		headers: {
			// N'ajoute Content-Type que s'il y a un body à envoyer, sinon un GET
			// se retrouverait avec un header inutile (voire gênant pour certains serveurs).
			...(body ? { 'Content-Type': 'application/json' } : {}),
			...headers
		},
		body: body ? JSON.stringify(body) : undefined
	});

	// Le backend peut répondre en JSON (cas normal) ou en texte brut (ex: erreur 500 générique) :
	// on adapte le parsing selon le Content-Type plutôt que de supposer du JSON partout.
	const contentType = response.headers.get('content-type') ?? '';
	const data = contentType.includes('application/json') ? await response.json() : await response.text();

	if (!response.ok) {
		console.log(`[api] ${method} ${path} → erreur ${response.status}`, data);
		throw new ApiError(data?.message ?? response.statusText, response.status, data);
	}

	console.log(`[api] ${method} ${path} → ${response.status}`);
	return data;
}

export const api = {
	/**
	 * @param {string} path
	 * @param {Omit<RequestOptions, 'method' | 'body'>} [options]
	 */
	get: (path, options) => request(path, { ...options, method: 'GET' }),
	/**
	 * @param {string} path
	 * @param {unknown} [body]
	 * @param {Omit<RequestOptions, 'method' | 'body'>} [options]
	 */
	post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
	/**
	 * @param {string} path
	 * @param {unknown} [body]
	 * @param {Omit<RequestOptions, 'method' | 'body'>} [options]
	 */
	put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
	/**
	 * @param {string} path
	 * @param {unknown} [body]
	 * @param {Omit<RequestOptions, 'method' | 'body'>} [options]
	 */
	patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
	/**
	 * @param {string} path
	 * @param {Omit<RequestOptions, 'method' | 'body'>} [options]
	 */
	delete: (path, options) => request(path, { ...options, method: 'DELETE' })
};
