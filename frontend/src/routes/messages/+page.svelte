
<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	// Pas encore de session/authentification connectée côté frontend (voir inscription/+page.svelte,
	// qui ne fait pas non plus d'appel API) : on simule l'utilisateur connecté en attendant un vrai
	// login. Le backend accepte lui aussi userId en clair pour la même raison (feat/auth-api pas
	// encore branchée sur ces routes), voir api/controllers/conversations.controller.js.
	const CURRENT_USER_ID = 1;

	let searchInput = $state('');
	let newMessage = $state('');
	let activeId = $state(null);
	let conversations = $state([]);
	let chargement = $state(true);
	let erreur = $state(null);

	const formateurHeure = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' });
	const formateurDate = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' });

	/**
	 * @param {string} dateIso
	 */
	function formaterHeure(dateIso) {
		const date = new Date(dateIso);
		const memeJour = date.toDateString() === new Date().toDateString();
		return memeJour ? formateurHeure.format(date) : formateurDate.format(date);
	}

	/**
	 * @param {{ users?: {id: number, firstName: string, lastName: string}[] }} conversation
	 */
	function autreParticipant(conversation) {
		return conversation.users?.find((u) => u.id !== CURRENT_USER_ID) ?? null;
	}

	/**
	 * @param {{firstName: string, lastName: string} | null} personne
	 */
	function initiales(personne) {
		if (!personne) return '?';
		return `${personne.firstName?.[0] ?? ''}${personne.lastName?.[0] ?? ''}`.toUpperCase();
	}

	/**
	 * Traduit une conversation reçue de l'API vers la forme attendue par le template.
	 * @param {object} conv
	 */
	function mapConversation(conv) {
		const contact = autreParticipant(conv);
		const dernierMessage = conv.messages?.[0];

		return {
			id: conv.id,
			nom: contact ? `${contact.firstName} ${contact.lastName}` : 'Utilisateur',
			avatar: initiales(contact),
			annonce: conv.listing?.title ?? '',
			prix: conv.listing?.price != null ? `${Number(conv.listing.price)} €` : '',
			dernierMsg: dernierMessage ? dernierMessage.content : 'Démarrez la conversation',
			heure: formaterHeure(dernierMessage ? dernierMessage.sentAt : conv.creationDate),
			nonLu: conv.unreadCount ?? 0,
			enLigne: false,
			messages: []
		};
	}

	onMount(async () => {
		try {
			const { data } = await api.get(`/api/v1/conversations?userId=${CURRENT_USER_ID}`);
			conversations = data.map(mapConversation);
		} catch (err) {
			console.error('[messages] impossible de charger les conversations', err);
			erreur = err;
		} finally {
			chargement = false;
		}
	});

	// Conversation actuellement sélectionnée
	let activeConv = $derived(
		conversations.find((conv) => conv.id === activeId)
	);

	// Conversations filtrées par la recherche
	let filteredConversations = $derived(
		conversations.filter((conv) =>
			conv.nom.toLowerCase().includes(searchInput.toLowerCase())
		)
	);

	async function selectionnerConversation(id) {
		activeId = id;

		const conversation = conversations.find((conv) => conv.id === id);

		if (!conversation) {
			return;
		}

		conversation.nonLu = 0;

		try {
			const { data } = await api.get(`/api/v1/conversations/${id}?userId=${CURRENT_USER_ID}`);
			conversation.messages = (data.messages ?? []).map((msg) => ({
				id: msg.id,
				texte: msg.content,
				heure: formaterHeure(msg.sentAt),
				type: msg.userId === CURRENT_USER_ID ? 'envoye' : 'recu'
			}));
		} catch (err) {
			console.error('[messages] impossible de charger la conversation', err);
		}
	}

	async function envoyerMessage() {
		const texte = newMessage.trim();

		if (!texte || !activeConv) {
			return;
		}

		newMessage = '';

		const conversation = conversations.find((conv) => conv.id === activeId);

		if (!conversation) {
			return;
		}

		try {
			const { data: message } = await api.post(`/api/v1/conversations/${activeId}/messages`, {
				userId: CURRENT_USER_ID,
				content: texte
			});

			conversation.messages.push({
				id: message.id,
				texte: message.content,
				heure: formaterHeure(message.sentAt),
				type: 'envoye'
			});
			conversation.dernierMsg = 'Vous : ' + message.content;
			conversation.heure = formaterHeure(message.sentAt);
		} catch (err) {
			console.error('[messages] envoi impossible', err);
			newMessage = texte;
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			envoyerMessage();
		}
	}
</script>

<div class="messaging-container">

	<!-- SIDEBAR -->
	<aside class="sidebar">
		<h2>Messages</h2>

		<div class="search-wrapper">
			<input
				type="text"
				placeholder="Rechercher une conversation"
				bind:value={searchInput}
			/>
		</div>

		<div class="conversations-list">
			{#each filteredConversations as conv}
				<button
					type="button"
					class="conv-item"
					class:selected={conv.id === activeId}
					class:unread={conv.nonLu > 0}
					onclick={() => selectionnerConversation(conv.id)}
				>
					<div class="avatar">
						{conv.avatar}
					</div>

					<div class="conv-details">
						<div class="conv-header">
							<span class="user-name">
								{conv.nom}
							</span>

							<span class="time">
								{conv.heure}
							</span>
						</div>

						<span class="item-title">
							{conv.annonce}
						</span>

						<p class="last-msg">
							{conv.dernierMsg}
						</p>
					</div>

					{#if conv.nonLu > 0}
						<span class="badge-unread">
							{conv.nonLu}
						</span>
					{/if}
				</button>
			{/each}

			{#if chargement}
				<div class="no-results">
					Chargement des conversations…
				</div>
			{:else if erreur}
				<div class="no-results">
					Impossible de charger les conversations.
				</div>
			{:else if filteredConversations.length === 0}
				<div class="no-results">
					Aucune conversation trouvée
				</div>
			{/if}
		</div>
	</aside>


	<!-- ZONE DE CHAT -->
	<main class="chat-area">

		{#if activeConv}

			<!-- HEADER DU CHAT -->
			<header class="chat-header">

				<div class="chat-user-info">
					<div class="avatar">
						{activeConv.avatar}
					</div>

					<div>
						<h3>
							{activeConv.nom}
						</h3>

						{#if activeConv.enLigne}
							<span class="status-online">
								• En ligne
							</span>
						{/if}
					</div>
				</div>

				<div class="item-card-mini">
					<div class="item-icon">
						📷
					</div>

					<div class="item-info">
						<span class="title">
							{activeConv.annonce}
						</span>

						<span class="price">
							{activeConv.prix}
						</span>
					</div>
				</div>

			</header>


			<!-- MESSAGES -->
			<div class="messages-feed">

				<div class="date-divider">
					Aujourd'hui
				</div>

				{#if activeConv.messages.length === 0}

					<div class="no-messages">
						<p>
							Aucun message pour le moment.
						</p>

						<span>
							Commencez la conversation !
						</span>
					</div>

				{:else}

					{#each activeConv.messages as msg}

						<div
							class="message-bubble-wrapper"
							class:recu={msg.type === 'recu'}
							class:envoye={msg.type === 'envoye'}
						>
							<div class="message-bubble">

								<p>
									{msg.texte}
								</p>

								<span class="msg-time">
									{msg.heure}
								</span>

							</div>
						</div>

					{/each}

				{/if}

			</div>


			<!-- BARRE D'ENVOI -->
			<div class="input-bar">

				<button
					class="btn-attachment"
					type="button"
					aria-label="Ajouter une pièce jointe"
				>
					📎
				</button>

				<input
					type="text"
					placeholder="Écrire un message..."
					bind:value={newMessage}
					onkeydown={handleKeydown}
				/>

				<button
					class="btn-send"
					class:active={newMessage.trim().length > 0}
					onclick={envoyerMessage}
					disabled={newMessage.trim().length === 0}
					type="button"
					aria-label="Envoyer le message"
				>
					➔
				</button>

			</div>

		{:else}

			<div class="empty-state">
				<div class="icon-envelope">
					✉️
				</div>

				<p>
					Sélectionnez une conversation pour commencer à échanger
				</p>
			</div>

		{/if}

	</main>

</div>


<style>
	* {
		box-sizing: border-box;
	}

	.messaging-container {
		display: flex;
		width: 100%;
		max-width: 1200px;
		height: calc(100vh - 40px);
		margin: 20px auto;
		overflow: hidden;

		background: #f7f6f0;
		border-radius: 16px;

		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			"Segoe UI",
			sans-serif;
	}


	/* SIDEBAR */

	.sidebar {
		width: 360px;
		flex-shrink: 0;

		display: flex;
		flex-direction: column;

		padding: 20px 16px;

		background: #fdfdfc;
		border-right: 1px solid #e2e8f0;
	}

	.sidebar h2 {
		margin: 0 0 16px;
		font-size: 1.3rem;
		color: #1a202c;
	}


	/* RECHERCHE */

	.search-wrapper {
		width: 100%;
	}

	.search-wrapper input {
		width: 100%;

		margin-bottom: 16px;
		padding: 10px 14px;

		background: #edf2f7;

		border: none;
		border-radius: 20px;

		outline: none;

		font-size: 0.85rem;
	}

	.search-wrapper input:focus {
		box-shadow: 0 0 0 2px rgba(45, 106, 79, 0.2);
	}


	/* LISTE */

	.conversations-list {
		flex: 1;

		display: flex;
		flex-direction: column;
		gap: 8px;

		overflow-y: auto;
	}

	.conv-item {
		position: relative;

		display: flex;
		align-items: center;

		width: 100%;
		padding: 12px;

		background: transparent;

		border: none;
		border-radius: 12px;

		text-align: left;

		cursor: pointer;

		transition: background 0.2s ease;
	}

	.conv-item:hover {
		background: #f0f4f1;
	}

	.conv-item.selected {
		background: #e6efe9;
	}


	/* AVATAR */

	.avatar {
		width: 38px;
		height: 38px;

		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		margin-right: 12px;

		background: #e2e8f0;
		color: #4a5568;

		border-radius: 50%;

		font-size: 0.9rem;
		font-weight: 600;
	}


	/* DETAILS CONVERSATION */

	.conv-details {
		flex: 1;
		min-width: 0;
	}

	.conv-header {
		display: flex;
		justify-content: space-between;
		gap: 8px;

		margin-bottom: 2px;
	}

	.user-name {
		color: #2d3748;

		font-size: 0.9rem;
		font-weight: 600;
	}

	.time {
		flex-shrink: 0;

		color: #a0aec0;

		font-size: 0.75rem;
	}

	.item-title {
		display: block;

		overflow: hidden;

		color: #718096;

		font-size: 0.78rem;
		font-weight: 600;

		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.last-msg {
		margin: 2px 0 0;

		overflow: hidden;

		color: #718096;

		font-size: 0.8rem;

		white-space: nowrap;
		text-overflow: ellipsis;
	}


	/* BADGE */

	.badge-unread {
		width: 18px;
		height: 18px;

		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		margin-left: 8px;

		background: #2d6a4f;
		color: white;

		border-radius: 50%;

		font-size: 0.75rem;
		font-weight: 700;
	}


	/* PAS DE RESULTAT */

	.no-results {
		padding: 30px 10px;

		color: #a0aec0;

		text-align: center;

		font-size: 0.85rem;
	}


	/* ZONE CHAT */

	.chat-area {
		flex: 1;
		min-width: 0;

		display: flex;
		flex-direction: column;

		background: #f7f6f0;
	}


	/* HEADER CHAT */

	.chat-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		gap: 20px;

		padding: 16px 24px;

		background: #f7f6f0;
	}

	.chat-user-info {
		display: flex;
		align-items: center;

		min-width: 0;
	}

	.chat-user-info h3 {
		margin: 0;

		color: #1a202c;

		font-size: 1rem;
	}

	.status-online {
		color: #38a169;

		font-size: 0.75rem;
	}


	/* CARTE ANNONCE */

	.item-card-mini {
		display: flex;
		align-items: center;

		gap: 10px;

		padding: 6px 14px;

		background: #e2e8f0;

		border-radius: 10px;
	}

	.item-icon {
		font-size: 1.2rem;
	}

	.item-info {
		min-width: 0;
	}

	.item-info .title {
		display: block;

		max-width: 220px;

		overflow: hidden;

		color: #2d3748;

		font-size: 0.8rem;
		font-weight: 600;

		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.item-info .price {
		display: block;

		color: #4a5568;

		font-size: 0.75rem;
	}


	/* MESSAGES */

	.messages-feed {
		flex: 1;

		display: flex;
		flex-direction: column;

		gap: 14px;

		padding: 24px;

		overflow-y: auto;
	}

	.date-divider {
		margin: 10px 0;

		color: #a0aec0;

		text-align: center;

		font-size: 0.75rem;
	}


	/* BULLES */

	.message-bubble-wrapper {
		display: flex;
		width: 100%;
	}

	.message-bubble-wrapper.recu {
		justify-content: flex-start;
	}

	.message-bubble-wrapper.envoye {
		justify-content: flex-end;
	}

	.message-bubble {
		max-width: 60%;

		padding: 12px 16px;

		border-radius: 16px;
	}

	.message-bubble-wrapper.recu .message-bubble {
		background: #e9e6d9;
		color: #2d3748;

		border-bottom-left-radius: 4px;
	}

	.message-bubble-wrapper.envoye .message-bubble {
		background: #2d6a4f;
		color: white;

		border-bottom-right-radius: 4px;
	}

	.message-bubble p {
		margin: 0 0 4px;

		font-size: 0.9rem;
		line-height: 1.4;
	}

	.msg-time {
		display: block;

		text-align: right;

		font-size: 0.7rem;

		opacity: 0.7;
	}


	/* AUCUN MESSAGE */

	.no-messages {
		margin: auto;

		color: #a0aec0;

		text-align: center;
	}

	.no-messages p {
		margin: 0 0 4px;

		font-size: 0.9rem;
	}

	.no-messages span {
		font-size: 0.8rem;
	}


	/* BARRE D'ENVOI */

	.input-bar {
		display: flex;
		align-items: center;

		gap: 12px;

		padding: 16px 24px;
	}

	.input-bar input {
		flex: 1;

		min-width: 0;

		padding: 12px 18px;

		background: white;

		border: 1px solid #cbd5e0;
		border-radius: 24px;

		outline: none;

		font-size: 0.9rem;
	}

	.input-bar input:focus {
		border-color: #2d6a4f;
		box-shadow: 0 0 0 2px rgba(45, 106, 79, 0.1);
	}


	/* BOUTON PIECE JOINTE */

	.btn-attachment {
		flex-shrink: 0;

		padding: 0;

		background: none;

		border: none;

		color: #718096;

		font-size: 1.2rem;

		cursor: pointer;
	}


	/* BOUTON ENVOYER */

	.btn-send {
		width: 40px;
		height: 40px;

		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background: #cbd5e0;
		color: white;

		border: none;
		border-radius: 50%;

		cursor: not-allowed;

		transition:
			background 0.2s ease,
			transform 0.1s ease;
	}

	.btn-send.active {
		background: #2d6a4f;
		cursor: pointer;
	}

	.btn-send.active:hover {
		background: #24563f;
	}

	.btn-send.active:active {
		transform: scale(0.95);
	}

	.btn-send:disabled {
		opacity: 0.8;
	}


	/* EMPTY STATE */

	.empty-state {
		flex: 1;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		padding: 30px;

		color: #a0aec0;

		text-align: center;
	}

	.icon-envelope {
		margin-bottom: 12px;

		font-size: 3rem;
	}


	/* RESPONSIVE */

	@media (max-width: 768px) {
		.messaging-container {
			height: 100vh;

			margin: 0;

			border-radius: 0;
		}

		.sidebar {
			width: 300px;
		}

		.chat-header {
			padding: 12px 16px;
		}

		.messages-feed {
			padding: 16px;
		}

		.input-bar {
			padding: 12px 16px;
		}

		.item-card-mini {
			display: none;
		}

		.message-bubble {
			max-width: 80%;
		}
	}

	@media (max-width: 600px) {
		.sidebar {
			width: 100%;
		}

		.chat-area {
			display: none;
		}
	}
</style>


