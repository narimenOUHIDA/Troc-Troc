<script>
  // Écran 5/9 des wireframes : Inscription (US02) — voir docs/conception/troctroc-wireframes.md §2.2

  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import Logo from '$lib/Logo.svelte';
  import api from '$lib/api';
  import { goto } from '$app/navigation';

  // Prénom/nom séparés ici, alors que le wireframe ASCII montre un seul champ "Nom complet" :
  // on suit plutôt le dictionnaire des données (UTILISATEUR.nom / UTILISATEUR.prenom, deux colonnes
  // distinctes). Un champ unique obligerait à re-découper la saisie côté serveur, peu fiable
  // (ex. noms composés, particules).
  let lastName = $state('');
  let firstName = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let postalCode = $state('');
  let postalCodeId = $state('');
  let accepteCgu = $state(false);
  let error = $state('');

  // Dérivé plutôt que vérifié seulement à la soumission : affiche l'erreur dès que l'utilisateur
  // a commencé à taper la confirmation, sans attendre un submit.
  let differentPassword = $derived(confirmPassword.length > 0 && password !== confirmPassword);

  /**
   * Pas encore de POST /auth/register côté backend (route à créer, et sa forme exacte —
   * /api/auth vs /api/v1/auth — reste à trancher en équipe, voir docs/conception/troctroc-endpoints.md
   * vs. la section endpoints du cahier des charges). Pour l'instant on ne fait que la validation client.
   * @param {SubmitEvent} event
   */
  async function onInscription(event) {
    event.preventDefault();
    error = '';

    try {
      const data = await api('/auth/register/', 'POST', {
        lastName,
        firstName,
        email,
        password,
        postalCodeId,
      });
      console.log('register OK', data);
      goto('/connexion');
    } catch (e) {
      error = e.message;
    }
  }
</script>

<svelte:head>
  <title>TrocTroc — Créer un compte</title>
</svelte:head>

<!-- En-tête minimal (logo seul, centré) : variante utilisée sur Connexion/Inscription
     (voir §Éléments transverses du wireframe). -->
<header class="auth-header">
  <a class="logo" href="/"><Logo /></a>
  <ThemeToggle />
</header>

<main class="auth-main">
  <form class="auth-card" onsubmit={onInscription}>
    <h1>Créer un compte</h1>

    <label>
      Prénom
      <input type="text" name="prenom" required bind:value={lastName} autocomplete="given-name" />
    </label>

    <label>
      Nom
      <input type="text" name="nom" required bind:value={firstName} autocomplete="family-name" />
    </label>

    <label>
      Adresse e-mail
      <input type="email" name="email" required bind:value={email} autocomplete="email" />
    </label>

    <!--   inputmode="numeric"
        pattern={'[0-9]{5}'}-->

    <label>
      Code postal
      <input
        type="text"
        name="codePostal"
        required
        bind:value={postalCodeId}
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
        bind:value={password}
        autocomplete="new-password"
      />
    </label>

    <label>
      Confirmation du mot de passe
      <input
        type="password"
        name="confirmation"
        required
        bind:value={confirmPassword}
        autocomplete="new-password"
      />
    </label>

    {#if differentPassword}
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
