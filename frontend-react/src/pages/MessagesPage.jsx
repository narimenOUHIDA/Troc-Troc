
import { Link } from 'react-router-dom';
import {
    Search,
    Send,
    Paperclip,
    Image as ImageIcon,
    MessageCircle
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';

import './MessagesPage.css';

const demoConversations = [
    {
        id: 1,
        name: 'Julie D.',
        initials: 'J',
        listing: 'Canapé 3 places en tissu gris',
        lastMessage: 'Bonjour, il est toujours dispo ?',
        time: '10:12',
        unread: 2,
        online: true,
    },
    {
        id: 2,
        name: 'Marc T.',
        initials: 'M',
        listing: 'Vélo enfant 20 pouces',
        lastMessage: 'Vous : Oui, je peux le garder',
        time: 'Hier',
        unread: 0,
        online: false,
    },
    {
        id: 3,
        name: 'Sophie L.',
        initials: 'S',
        listing: 'Table basse en bois',
        lastMessage: 'Parfait, à demain alors !',
        time: 'Lun',
        unread: 0,
        online: false,
    },
    {
        id: 4,
        name: 'Ahmed B.',
        initials: 'A',
        listing: 'Console de jeux rétro',
        lastMessage: 'Est-ce que la manette est incluse ?',
        time: '22 août',
        unread: 1,
        online: false,
    },
];

const demoMessages = [
    {
        id: 1,
        text: 'Bonjour, il est toujours disponible ?',
        time: '10:08',
        sender: 'received',
    },
    {
        id: 2,
        text: 'Oui toujours disponible !',
        time: '10:15',
        sender: 'sent',
    },
    {
        id: 3,
        text: 'Super, je peux passer le récupérer ce soir ?',
        time: '10:22',
        sender: 'received',
    },
    {
        id: 4,
        text: 'Avec plaisir, vers 19h ?',
        time: '10:25',
        sender: 'sent',
    },
];

function MessagesPage() {
    return (
        <>
            <Header />

            <main className="messages-page">
                <div className="messages-container">

                    <div className="messages-page-heading">
                        <h1>Messagerie</h1>
                        <p>
                            Retrouvez vos conversations avec les membres
                            de TrocTroc.
                        </p>
                    </div>

                    <div className="messages-layout">

                        {/* Colonne des conversations */}
                        <aside className="conversations-panel">

                            <div className="conversations-heading">
                                <h2>Messages</h2>
                            </div>

                            <div className="conversations-search">
                                <Search size={17} />

                                <input
                                    type="search"
                                    placeholder="Rechercher une conversation"
                                    aria-label="Rechercher une conversation"
                                />
                            </div>

                            <div className="conversations-list">
                                {demoConversations.map((conversation) => (
                                    <button
                                        type="button"
                                        className={`conversation-item ${conversation.id === 1
                                                ? 'selected'
                                                : ''
                                            }`}
                                        key={conversation.id}
                                    >
                                        <div className="conversation-avatar">
                                            {conversation.initials}

                                            {conversation.online && (
                                                <span className="conversation-online-dot" />
                                            )}
                                        </div>

                                        <div className="conversation-info">
                                            <div className="conversation-top">
                                                <strong>
                                                    {conversation.name}
                                                </strong>
                                                <span>
                                                    {conversation.time}
                                                </span>
                                            </div>

                                            <p className="conversation-listing-title">
                                                {conversation.listing}
                                            </p>

                                            <p className="conversation-preview">
                                                {conversation.lastMessage}
                                            </p>
                                        </div>

                                        {conversation.unread > 0 && (
                                            <span className="conversation-unread">
                                                {conversation.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Zone de discussion */}
                        <section className="chat-panel">

                            {/* En-tête de la conversation */}
                            <div className="chat-header">
                                <div className="chat-contact">
                                    <div className="conversation-avatar">
                                        J
                                        <span className="conversation-online-dot" />
                                    </div>

                                    <div>
                                        <h2>Julie D.</h2>
                                        <p className="chat-online">
                                            En ligne
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    to="/annonces/1"
                                    className="chat-listing-link"
                                >
                                    <div className="chat-listing-image">
                                        <ImageIcon size={20} />
                                    </div>

                                    <div>
                                        <strong>
                                            Canapé 3 places en tissu gris
                                        </strong>
                                        <span>120 €</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Messages */}
                            <div className="chat-messages">
                                <div className="chat-date">
                                    Aujourd'hui, 10:08
                                </div>

                                {demoMessages.map((message) => (
                                    <div
                                        className={`chat-message-row ${message.sender}`}
                                        key={message.id}
                                    >
                                        <div className="chat-message-content">
                                            <div className="chat-bubble">
                                                {message.text}
                                            </div>

                                            <span className="chat-message-time">
                                                {message.time}
                                                {message.sender === 'sent' && (
                                                    <span> ✓✓</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Barre de saisie */}
                            <form className="chat-compose">
                                <button
                                    type="button"
                                    className="chat-attachment-button"
                                    aria-label="Joindre un fichier"
                                >
                                    <Paperclip size={19} />
                                </button>

                                <input
                                    type="text"
                                    placeholder="Écrire un message..."
                                    aria-label="Écrire un message"
                                />

                                <button
                                    type="button"
                                    className="chat-send-button"
                                    aria-label="Envoyer le message"
                                >
                                    <Send size={18} />
                                </button>
                            </form>

                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default MessagesPage;
