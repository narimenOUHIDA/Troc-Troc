<script>
  import ThemeToggle from '$lib/ThemeToggle.svelte';
  import Logo from '$lib/Logo.svelte';

  import api from '$lib/api';
  import { setAuth } from '$lib/store/auth.svelte.js';
  import { goto } from '$app/navigation';

  let { switchToRegister } = $props();
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let inProgress = $state(false);

  async function handelLogin(event) {
    event.preventDefault();
    error = '';
    inProgress = true;

    try {
      const data = await api('/auth/login', 'POST', { email, password });
      console.log('LOGIN OK', data);
      setAuth(data.user, data.token);
      console.log('AVANT GOTO');
      goto('/');
    } catch (e) {
      error = e.message;
    } finally {
      inProgress = false;
    }
  }
</script>

<svelte:head>
  <title>TrocTroc — Se connecter</title>
</svelte:head>

<!-- En-tête minimal (logo seul, centré) : variante utilisée sur Connexion/Inscription
     (voir §Éléments transverses du wireframe). -->
<header class="auth-header">
  <a class="logo" href="/"><Logo /></a>
  <ThemeToggle />
</header>

<main class="auth-main">
  <form class="auth-card" onsubmit={handelLogin}>
    <h1>Se connecter</h1>

    <label>
      Adresse e-mail
      <input type="email" bind:value={email} placeholder="Email" required />
    </label>

    <label>
      Mot de passe
      <input type="password" bind:value={password} placeholder="Mot de passe" required />
    </label>

    <p class="auth-switch">
      <a href="/forgetPassword">Mot de passe oublié ?</a>
    </p>

    {#if error}<p class="form-error">{error}</p>{/if}

    <button class="button-primary" type="submit">Se connecter</button>

    <p class="auth-switch">Pas encore de compte ? <a href="/inscription">S'inscrire</a></p>
  </form>

  <a class="auth-back" href="/">&larr; Retour à l'accueil</a>
</main>
