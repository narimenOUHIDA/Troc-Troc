<!-- src/routes/mon-profil/+page.svelte -->
<script>
  // Écran : Mes informations (US — gestion du profil utilisateur)
  // Même structure d'onglets que /espace-personnel pour rester cohérent.

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Header from '$lib/Header.svelte';
  import api from '$lib/api.js';
  import { authStore, isAuthenticated } from '$lib/store/auth.svelte.js';

  // ⚠️ Liste en dur temporaire, comme sur la page Inscription — à remplacer
  // par un vrai GET /postal-codes si l'endpoint existe un jour.
  const codesPostaux = [
    { id: 1, label: 'Lyon (69001)' },
    { id: 2, label: 'Villeurbanne (69100)' },
  ];

  let firstName = $state('');
  let lastName = $state('');
  let email = $state('');
  let postalCodeId = $state('');
  let registrationDate = $state(null);

  let chargement = $state(true);
  let erreur = $state('');
  let succes = $state('');
  let enregistrement = $state(false);

  onMount(async () => {
    if (!isAuthenticated()) {
      goto('/connexion');
      return;
    }

    try {
      const moi = await api('/auth/me');
      firstName = moi.firstName;
      lastName = moi.lastName;
      email = moi.email;
      postalCodeId = moi.postalCodeId;
      registrationDate = moi.registrationDate;
    } catch (e) {
      erreur = e.message;
    } finally {
      chargement = false;
    }
  });

  async function onEnregistrer(event) {
    event.preventDefault();
    erreur = '';
    succes = '';
    enregistrement = true;

    try {
      const moi = await api('/auth/me', 'PATCH', {
        firstName,
        lastName,
        email,
        postalCodeId: Number(postalCodeId),
      });

      // Garde le header/authStore synchronisé avec les nouvelles infos
      authStore.user = { ...authStore.user, ...moi };
      localStorage.setItem('user', JSON.stringify(authStore.user));

      succes = 'Vos informations ont été mises à jour.';
    } catch (e) {
      erreur = e.message;
    } finally {
      enregistrement = false;
    }
  }

  function formaterDate(dateIso) {
    if (!dateIso) return '';
    return new Date(dateIso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>TrocTroc — Mes informations</title>
</svelte:head>

<Header />

<main class="profil-main">
  <div class="profil-entete">
    <div class="avatar">
      {firstName?.[0] ?? ''}{lastName?.[0] ?? ''}
    </div>
    <div>
      <h1>{firstName} {lastName}</h1>
      {#if registrationDate}
        <p class="profil-meta">Membre depuis {formaterDate(registrationDate)}</p>
      {/if}
    </div>
  </div>

  <nav class="espace-tabs">
    <a class="tab" href="/espace-personnel">Mes annonces</a>
    <span class="tab tab-active">Mes informations</span>
    <a class="tab" href="/messagerie">Messagerie</a>
  </nav>

  {#if chargement}
    <p class="profil-message">Chargement de vos informations...</p>
  {:else}
    <form class="profil-form" onsubmit={onEnregistrer}>
      {#if erreur}<p class="form-error">{erreur}</p>{/if}
      {#if succes}<p class="form-success">{succes}</p>{/if}

      <div class="profil-row">
        <label>
          Prénom
          <input type="text" required bind:value={firstName} />
        </label>
        <label>
          Nom
          <input type="text" required bind:value={lastName} />
        </label>
      </div>

      <label>
        Adresse e-mail
        <input type="email" required bind:value={email} />
      </label>

      <label>
        Code postal
        <select required bind:value={postalCodeId}>
          <option value="" disabled>Choisir un code postal</option>
          {#each codesPostaux as cp (cp.id)}
            <option value={cp.id}>{cp.label}</option>
          {/each}
        </select>
        <span class="profil-hint">Utilisé pour le rayon de 50 km autour de chez vous.</span>
      </label>

      <button type="submit" class="button-primary" disabled={enregistrement}>
        {enregistrement ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
    </form>
  {/if}
</main>

<style>
  .profil-main {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .profil-entete {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #e4f0ea;
    color: #2f7d5b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .profil-entete h1 {
    margin: 0;
    font-size: 1.3rem;
    font-family: Cambria, Georgia, serif;
    color: #19352b;
  }

  .profil-meta {
    margin: 0.15rem 0 0;
    color: #6b6960;
    font-size: 0.85rem;
  }

  .espace-tabs {
    display: flex;
    gap: 1.5rem;
    border-bottom: 1px solid #e4e1d6;
    margin-bottom: 1.75rem;
  }

  .tab {
    padding-bottom: 0.6rem;
    color: #6b6960;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .tab-active {
    color: #19352b;
    font-weight: 700;
    border-bottom: 2px solid #2f7d5b;
  }

  .profil-message {
    color: #6b6960;
    text-align: center;
    padding: 2rem 0;
  }

  .profil-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .profil-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-weight: 600;
    font-size: 0.85rem;
    color: #3a3833;
  }

  input,
  select {
    border: 1.5px solid #e4e1d6;
    border-radius: 10px;
    padding: 0.65rem 0.9rem;
    font-size: 0.95rem;
    font-family: inherit;
    font-weight: 400;
    color: #19352b;
  }

  input:focus,
  select:focus {
    outline: none;
    border-color: #2f7d5b;
    box-shadow: 0 0 0 3px rgba(47, 125, 91, 0.12);
  }

  .profil-hint {
    font-size: 0.78rem;
    color: #8c897e;
    font-weight: 400;
  }

  .button-primary {
    align-self: flex-start;
    background: #2f7d5b;
    color: #fff;
    border: none;
    border-radius: 999px;
    padding: 0.75rem 1.75rem;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
  }

  .button-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .form-error {
    color: #c0392b;
    font-size: 0.9rem;
    margin: 0;
  }

  .form-success {
    color: #2f7d5b;
    font-size: 0.9rem;
    margin: 0;
  }
</style>
