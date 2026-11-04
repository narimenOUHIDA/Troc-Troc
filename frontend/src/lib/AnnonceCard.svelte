<!-- src/lib/AnnonceCard.svelte -->
<script>
  // Carte annonce réutilisable — même design que /annonces et /espace-personnel

  let { annonce } = $props();

  function urlPhoto(url) {
    return `${import.meta.env.VITE_API_URL}/${url}`;
  }
</script>

<a class="carte-annonce" href={`/annonces/${annonce.id}`}>
  <div class="carte-image">
    {#if annonce.photos?.[0]}
      <img src={urlPhoto(annonce.photos[0].url)} alt={annonce.title} />
    {:else}
      <svg viewBox="0 0 24 24" width="28" height="28">
        <path
          d="M4 17 L4 9 L9 4 L15 4 L20 9 L20 17 Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
        <circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    {/if}

    {#if annonce.category}
      <span class="carte-badge">{annonce.category.name}</span>
    {/if}

    {#if annonce.status?.name === 'Vendu'}
      <span class="carte-vendu">Vendu</span>
    {/if}
  </div>

  <div class="carte-corps">
    <h3>{annonce.title}</h3>
    <span class="carte-prix">{annonce.price} €</span>
    {#if annonce.user}
      <span class="carte-vendeur">{annonce.user.firstName} {annonce.user.lastName}</span>
    {/if}
  </div>
</a>

<style>
  .carte-annonce {
    display: block;
    background: #fff;
    border: 1.5px solid #e4e1d6;
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition:
      border-color 0.15s ease,
      transform 0.15s ease;
  }

  .carte-annonce:hover {
    border-color: #2f7d5b;
    transform: translateY(-2px);
  }

  .carte-image {
    aspect-ratio: 1 / 0.75;
    background: #e4e1d6;
    color: #b3afa0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .carte-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carte-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #fff;
    color: #2f7d5b;
    font-size: 0.7rem;
    font-weight: 600;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
  }

  .carte-vendu {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #5f5e5a;
    color: #fff;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 0.2rem 0.55rem;
    border-radius: 10px;
  }

  .carte-corps {
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .carte-corps h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #19352b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .carte-prix {
    font-weight: 700;
    color: #2f7d5b;
    font-size: 1.05rem;
  }

  .carte-vendeur {
    font-size: 0.75rem;
    color: #8c897e;
  }
</style>
