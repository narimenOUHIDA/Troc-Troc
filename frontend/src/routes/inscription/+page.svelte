<script>
	// Écran 5/9 des wireframes : Inscription (US02) — voir docs/conception/troctroc-wireframes.md §2.2

	// Prénom/nom séparés ici, alors que le wireframe ASCII montre un seul champ "Nom complet" :
	// on suit plutôt le dictionnaire des données (UTILISATEUR.nom / UTILISATEUR.prenom, deux colonnes
	// distinctes). Un champ unique obligerait à re-découper la saisie côté serveur, peu fiable
	// (ex. noms composés, particules).
	let prenom = $state('');
	let nom = $state('');
	let email = $state('');
	let codePostal = $state('');
	let motDePasse = $state('');
	let confirmation = $state('');
	let accepteCgu = $state(false);

	// Dérivé plutôt que vérifié seulement à la soumission : affiche l'erreur dès que l'utilisateur
	// a commencé à taper la confirmation, sans attendre un submit.
	let motDePasseDifferent = $derived(confirmation.length > 0 && motDePasse !== confirmation);

	/**
	 * Pas encore de POST /auth/register côté backend (route à créer, et sa forme exacte —
	 * /api/auth vs /api/v1/auth — reste à trancher en équipe, voir docs/conception/troctroc-endpoints.md
	 * vs. la section endpoints du cahier des charges). Pour l'instant on ne fait que la validation client.
	 * @param {SubmitEvent} event
	 */
	function onInscription(event) {
		event.preventDefault();

		if (motDePasseDifferent) {
			console.log('[inscription] mots de passe différents, envoi annulé');
			return;
		}

		// Le mot de passe est volontairement exclu du log.
		console.log('[inscription] création de compte', { prenom, nom, email, codePostal });
	}
</script>

<svelte:head>
	<title>TrocTroc — Créer un compte</title>
</svelte:head>

<!-- En-tête minimal (logo seul, centré) : variante utilisée sur Connexion/Inscription
     (voir §Éléments transverses du wireframe). -->
<header class="auth-header">
	<a class="logo" href="/">TT TrocTroc</a>
</header>

<main class="auth-main">
	<form class="auth-card" onsubmit={onInscription}>
		<h1>Créer un compte</h1>

		<label>
			Prénom
			<input type="text" name="prenom" required bind:value={prenom} autocomplete="given-name" />
		</label>

		<label>
			Nom
			<input type="text" name="nom" required bind:value={nom} autocomplete="family-name" />
		</label>

		<label>
			Adresse e-mail
			<input type="email" name="email" required bind:value={email} autocomplete="email" />
		</label>

		<label>
			Code postal
			<input
				type="text"
				name="codePostal"
				required
				bind:value={codePostal}
				inputmode="numeric"
				pattern={'[0-9]{5}'}
				maxlength="5"
				autocomplete="postal-code"
			/>
			<span class="hint">Utilisé pour le rayon de 50 km autour de chez vous.</span>
		</label>

		<label>
			Mot de passe
			<input
				type="password"
				name="motDePasse"
				required
				minlength="8"
				bind:value={motDePasse}
				autocomplete="new-password"
			/>
		</label>

		<label>
			Confirmation du mot de passe
			<input
				type="password"
				name="confirmation"
				required
				bind:value={confirmation}
				autocomplete="new-password"
				aria-invalid={motDePasseDifferent}
			/>
		</label>

		{#if motDePasseDifferent}
			<p class="form-error">Les mots de passe ne correspondent pas.</p>
		{/if}

		<label class="checkbox">
			<input type="checkbox" name="cgu" required bind:checked={accepteCgu} />
			J'accepte les <a href="/cgu">CGU</a>
		</label>

		<button class="button-primary" type="submit">Créer mon compte</button>

		<p class="auth-switch">Déjà un compte ? <a href="/connexion">Se connecter</a></p>
	</form>

	<a class="auth-back" href="/">&larr; Retour à l'accueil</a>
</main>
