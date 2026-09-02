// Données mock partagées entre l'accueil, la liste (/annonces) et le détail (/annonces/[id]), en
// attendant GET /annonces et GET /annonces/:id (voir docs/conception/troctroc-endpoints.md).
// Centralisées ici pour que les 3 pages affichent les mêmes annonces (mêmes id/titre/prix...) au
// lieu de dupliquer des tableaux qui finiraient par diverger.

export const categories = [
	'Mobilier',
	'Électroménager',
	'Vêtements',
	'Sport & Loisirs',
	'Multimédia',
	'Enfants & Bébé',
	'Bricolage & Jardin',
	'Véhicules'
];

// Quelques vendeurs réutilisés sur plusieurs annonces (noms repris des wireframes espace
// personnel/messagerie, docs/conception/troctroc-wireframes.md §3.1-3.2, pour rester cohérent).
const vendeurs = {
	camille: { nom: 'Camille D.', membreDepuis: 2024, nbAnnonces: 8 },
	julien: { nom: 'Julien M.', membreDepuis: 2023, nbAnnonces: 5 },
	sofia: { nom: 'Sofia R.', membreDepuis: 2025, nbAnnonces: 3 },
	marc: { nom: 'Marc L.', membreDepuis: 2022, nbAnnonces: 12 },
	nadia: { nom: 'Nadia B.', membreDepuis: 2024, nbAnnonces: 6 },
	karim: { nom: 'Karim T.', membreDepuis: 2025, nbAnnonces: 2 },
	lea: { nom: 'Léa F.', membreDepuis: 2023, nbAnnonces: 9 },
	hugo: { nom: 'Hugo P.', membreDepuis: 2024, nbAnnonces: 4 }
};

// `statut` reflète ANNONCE.id_statut (dictionnaire des données) : 'disponible' | 'vendu'.
export const annonces = [
	{ id: 1, titre: 'Vélo VTT 26 pouces', prix: 45, distanceKm: 3, categorie: 'Sport & Loisirs', statut: 'disponible', ville: 'Lyon', codePostal: '69003', datePublication: '2026-08-30', vendeur: vendeurs.camille, description: "Vélo VTT 26 pouces, bon état, quelques traces d'usure normales. Pneus et freins récemment changés." },
	{ id: 2, titre: 'Vélo ville', prix: 90, distanceKm: 6, categorie: 'Sport & Loisirs', statut: 'vendu', ville: 'Villeurbanne', codePostal: '69100', datePublication: '2026-08-29', vendeur: vendeurs.julien, description: 'Vélo de ville avec panier avant, garde-boue et éclairage. Idéal trajets quotidiens.' },
	{ id: 3, titre: 'Vélo électrique', prix: 380, distanceKm: 5, categorie: 'Sport & Loisirs', statut: 'disponible', ville: 'Vénissieux', codePostal: '69200', datePublication: '2026-08-28', vendeur: vendeurs.sofia, description: 'Vélo à assistance électrique, batterie 500 Wh, autonomie ~60 km. Peu servi.' },
	{ id: 4, titre: 'Canapé 3 places', prix: 120, distanceKm: 6, categorie: 'Mobilier', statut: 'disponible', ville: 'Bron', codePostal: '69500', datePublication: '2026-08-27', vendeur: vendeurs.marc, description: 'Canapé 3 places en tissu gris, confortable, sans taches ni déchirures. À venir récupérer.' },
	{ id: 5, titre: 'Table basse en bois', prix: 30, distanceKm: 9, categorie: 'Mobilier', statut: 'disponible', ville: 'Caluire-et-Cuire', codePostal: '69300', datePublication: '2026-08-25', vendeur: vendeurs.nadia, description: 'Table basse en chêne massif, quelques marques d\'usage cohérentes avec l\'âge du meuble.' },
	{ id: 6, titre: 'Chaise de bureau', prix: 40, distanceKm: 7, categorie: 'Mobilier', statut: 'vendu', ville: 'Oullins', codePostal: '69600', datePublication: '2026-08-24', vendeur: vendeurs.karim, description: 'Chaise de bureau ergonomique, accoudoirs réglables, roulettes en bon état.' },
	{ id: 7, titre: 'Console de jeux', prix: 60, distanceKm: 5, categorie: 'Multimédia', statut: 'disponible', ville: 'Écully', codePostal: '69130', datePublication: '2026-08-23', vendeur: vendeurs.lea, description: 'Console de salon avec un manette et trois jeux inclus. Fonctionne parfaitement.' },
	{ id: 8, titre: 'Téléviseur 40"', prix: 90, distanceKm: 12, categorie: 'Multimédia', statut: 'disponible', ville: 'Saint-Priest', codePostal: '69800', datePublication: '2026-08-22', vendeur: vendeurs.hugo, description: 'Téléviseur LED 40 pouces, Full HD, télécommande fournie. Vendu suite à déménagement.' },
	{ id: 9, titre: 'Enceinte bluetooth', prix: 20, distanceKm: 4, categorie: 'Multimédia', statut: 'disponible', ville: 'Vaulx-en-Velin', codePostal: '69120', datePublication: '2026-08-21', vendeur: vendeurs.camille, description: 'Petite enceinte bluetooth portable, autonomie ~8h, livrée avec câble de charge.' },
	{ id: 10, titre: 'Perceuse-visseuse', prix: 35, distanceKm: 4, categorie: 'Bricolage & Jardin', statut: 'disponible', ville: 'Meyzieu', codePostal: '69330', datePublication: '2026-08-19', vendeur: vendeurs.julien, description: 'Perceuse-visseuse sans fil avec deux batteries et son coffret de rangement.' },
	{ id: 11, titre: 'Tondeuse à gazon', prix: 75, distanceKm: 14, categorie: 'Bricolage & Jardin', statut: 'disponible', ville: 'Décines-Charpieu', codePostal: '69150', datePublication: '2026-08-18', vendeur: vendeurs.sofia, description: 'Tondeuse thermique, bac de ramassage inclus, entretien à jour.' },
	{ id: 12, titre: 'Établi', prix: 55, distanceKm: 11, categorie: 'Bricolage & Jardin', statut: 'vendu', ville: 'Lyon', codePostal: '69007', datePublication: '2026-08-17', vendeur: vendeurs.marc, description: "Établi d'atelier avec étau intégré, plateau bois massif." },
	{ id: 13, titre: 'Manteau hiver', prix: 25, distanceKm: 2, categorie: 'Vêtements', statut: 'disponible', ville: 'Lyon', codePostal: '69003', datePublication: '2026-08-16', vendeur: vendeurs.nadia, description: 'Manteau doublé taille M, porté une saison, très bon état.' },
	{ id: 14, titre: 'Paire de baskets', prix: 15, distanceKm: 3, categorie: 'Vêtements', statut: 'disponible', ville: 'Villeurbanne', codePostal: '69100', datePublication: '2026-08-15', vendeur: vendeurs.karim, description: 'Baskets taille 42, portées quelques fois, semelles peu usées.' },
	{ id: 15, titre: 'Robe de soirée', prix: 35, distanceKm: 8, categorie: 'Vêtements', statut: 'disponible', ville: 'Vénissieux', codePostal: '69200', datePublication: '2026-08-14', vendeur: vendeurs.lea, description: "Robe de soirée taille 38, portée une fois, nettoyée à sec avant l'annonce." },
	{ id: 16, titre: 'Poussette', prix: 55, distanceKm: 8, categorie: 'Enfants & Bébé', statut: 'disponible', ville: 'Bron', codePostal: '69500', datePublication: '2026-08-12', vendeur: vendeurs.hugo, description: 'Poussette 3 roues, pliage compact, habillage pluie inclus. Bon état général.' },
	{ id: 17, titre: 'Lit bébé évolutif', prix: 65, distanceKm: 10, categorie: 'Enfants & Bébé', statut: 'disponible', ville: 'Caluire-et-Cuire', codePostal: '69300', datePublication: '2026-08-11', vendeur: vendeurs.camille, description: 'Lit bébé évolutif en bois, 3 hauteurs de matelas, montage facile.' },
	{ id: 18, titre: 'Trotteur', prix: 18, distanceKm: 6, categorie: 'Enfants & Bébé', statut: 'vendu', ville: 'Oullins', codePostal: '69600', datePublication: '2026-08-10', vendeur: vendeurs.julien, description: 'Trotteur avec jeux d\'éveil intégrés, bon état, nettoyé.' },
	{ id: 19, titre: 'Réfrigérateur', prix: 150, distanceKm: 13, categorie: 'Électroménager', statut: 'disponible', ville: 'Écully', codePostal: '69130', datePublication: '2026-08-09', vendeur: vendeurs.sofia, description: 'Réfrigérateur combiné 250L, classe énergétique A+, fonctionne très bien.' },
	{ id: 20, titre: 'Micro-ondes', prix: 25, distanceKm: 5, categorie: 'Électroménager', statut: 'disponible', ville: 'Saint-Priest', codePostal: '69800', datePublication: '2026-08-08', vendeur: vendeurs.marc, description: 'Micro-ondes 800W avec fonction grill, propre et fonctionnel.' },
	{ id: 21, titre: 'Aspirateur', prix: 40, distanceKm: 7, categorie: 'Électroménager', statut: 'disponible', ville: 'Vaulx-en-Velin', codePostal: '69120', datePublication: '2026-08-07', vendeur: vendeurs.nadia, description: 'Aspirateur traîneau avec sac, puissance 900W, accessoires complets.' },
	{ id: 22, titre: 'Trottinette électrique', prix: 180, distanceKm: 9, categorie: 'Véhicules', statut: 'disponible', ville: 'Meyzieu', codePostal: '69330', datePublication: '2026-08-06', vendeur: vendeurs.karim, description: 'Trottinette électrique, autonomie ~25 km, pliable, batterie en bon état.' },
	{ id: 23, titre: 'Remorque vélo', prix: 60, distanceKm: 15, categorie: 'Véhicules', statut: 'disponible', ville: 'Décines-Charpieu', codePostal: '69150', datePublication: '2026-08-05', vendeur: vendeurs.lea, description: 'Remorque vélo 2 places avec harnais de sécurité et bâche de pluie.' },
	{ id: 24, titre: 'Casque moto', prix: 45, distanceKm: 5, categorie: 'Véhicules', statut: 'vendu', ville: 'Lyon', codePostal: '69007', datePublication: '2026-08-04', vendeur: vendeurs.hugo, description: 'Casque moto taille M, homologué, visière claire et teintée fournies.' }
];

/**
 * @param {string | number} id
 */
export function trouverAnnonce(id) {
	return annonces.find((annonce) => annonce.id === Number(id));
}

/**
 * @param {{ id: number, categorie: string }} annonce
 * @param {number} [limite]
 */
export function annoncesSimilaires(annonce, limite = 4) {
	return annonces
		.filter((autre) => autre.id !== annonce.id && autre.categorie === annonce.categorie)
		.slice(0, limite);
}
