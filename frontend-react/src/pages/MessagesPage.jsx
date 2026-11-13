
import { Link, useParams } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect } from 'react'
import {
    Search,
    Send,
    Image as ImageIcon,
} from 'lucide-react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    getConversationById,
    getConversations,
    createMessage
} from "../api/conversations";
import './MessagesPage.css';

function MessagesPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const formRef = useRef(null); //pour vider le formulaire après l'envoi.
    const messagesEndRef = useRef(null); //pour faire défiler la discussion jusqu'en bas.

    const { mutate, isPending: isSending, isError: isErrorMessage, error: errorMessage } = useMutation({
        mutationFn: ({ id, content }) => createMessage(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversation", id],
            });

            queryClient.invalidateQueries({
                queryKey: ["conversations"],
            });

            formRef.current?.reset();
        }
    });

    const {
        data: conversations = [],
        isPending: isPendingConversations,
        isError: isErrorConversations,
    } = useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
        refetchInterval: 3000,
    });


    const { data: conversation, isPending, isError, error } = useQuery({
        queryKey: ['conversation', id],
        queryFn: () => getConversationById(id),
        refetchInterval: 3000, // affiche les nouveau mesg reçu sans actualiser tantque je suis dans la page 
    });

    useEffect(() => {
        if (conversation?.messages) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [conversation?.messages]);

    if (isPending) {
        return <p>Chargement de la Conversation...</p>;
    }

    if (isError) {
        return <p>Erreur : {error.message}</p>;
    }

    if (!conversation) {
        return <p>Conversation introuvable</p>;
    }

    console.log("Toutes les conversations :", conversations);

    const handelSent = (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const content = formData.get("content")?.trim();
        if (!content) return;

        mutate({ id, content });
    }

    const contact = conversation.users.find( //l'autre participant de la conversation.
        (participant) => participant.id !== user.id
    );

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
                                {conversations.map((item) => {
                                    const interlocuteur = item.users.find(
                                        (participant) => participant.id !== user.id
                                    );

                                    const dernierMessage = item.messages.at(-1);

                                    return (
                                        <Link
                                            key={item.id}
                                            to={`/messagerie/${item.id}`}
                                            className={`conversation-item ${item.id === Number(id) ? "selected" : ""
                                                }`}
                                        >
                                            <div className="conversation-avatar">
                                                {interlocuteur?.firstName?.charAt(0).toUpperCase()}
                                                {interlocuteur?.lastName?.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="conversation-info">
                                                <div className="conversation-top">
                                                    <strong>
                                                        {interlocuteur?.firstName} {interlocuteur?.lastName}
                                                    </strong>
                                                </div>

                                                <p className="conversation-listing-title">
                                                    {item.listing.title}
                                                </p>

                                                <p className="conversation-preview">
                                                    {dernierMessage?.content ?? "Aucun message"}
                                                </p>
                                            </div>

                                            {item.unreadCount > 0 && (
                                                <span className="conversation-unread">
                                                    {item.unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </aside>

                        <section className="chat-panel">
                            <div className="chat-header">
                                <div className="chat-contact">
                                    <div className="conversation-avatar">
                                        {contact?.firstName?.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <h2>{contact?.firstName} {contact?.lastName}</h2>
                                    </div>
                                </div>

                                <Link
                                    to={`/annonces/${conversation.listingId}`}
                                    className="chat-listing-link"
                                >
                                    <div className="chat-listing-image">
                                        <ImageIcon size={20} />
                                    </div>

                                    <div>
                                        <strong>{conversation.listing.title}</strong>
                                        <span>{conversation.listing.price} €</span>
                                    </div>
                                </Link>
                            </div>


                            <div className="chat-messages">
                                <div className="chat-date">
                                    Aujourd'hui, 10:08
                                </div>
                                {conversation.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`chat-message-row ${message.userId === user.id ? "sent" : "received"
                                            }`}
                                    >
                                        <div className="chat-message-content">
                                            <div className="chat-bubble">
                                                {message.content}
                                            </div>

                                            <span className="chat-message-time">
                                                {new Date(message.sentAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>


                            <form className="chat-compose" ref={formRef} onSubmit={handelSent}>
                                <input
                                    type="text"
                                    name="content"
                                    placeholder="Écrire un message..."
                                    aria-label="Écrire un message"
                                />

                                <button
                                    type="submit"
                                    className="chat-send-button"
                                    aria-label="Envoyer le message"
                                    disabled={isSending}
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            {isErrorMessage && (
                                <p className="chat-error" role="alert">
                                    {errorMessage?.message || "Impossible d'envoyer le message."}
                                </p>
                            )}
                        </section>
                    </div>
                </div>
            </main >
            <Footer />
        </>
    );
}

export default MessagesPage;
