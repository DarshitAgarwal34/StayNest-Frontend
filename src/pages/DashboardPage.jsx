import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  createConversation,
  fetchAdminOverview,
  fetchConversations,
  fetchMessages,
  fetchMessagesByConversation,
  fetchNotifications,
  fetchProperties,
  fetchServices,
  getStoredUser,
  sendConversationMessage,
} from '../api/api';
import { connectSocket, joinConversation } from '../socket';

function DashboardPage() {
  const user = getStoredUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [allMessages, setAllMessages] = useState([]);
  const [conversationList, setConversationList] = useState([]);
  const [threadMessages, setThreadMessages] = useState([]);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [adminOverview, setAdminOverview] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(() => Number(location.state?.conversationId) || null);
  const [messageDraft, setMessageDraft] = useState('');
  const [conversationName, setConversationName] = useState('');
  const [conversationMembers, setConversationMembers] = useState('');
  const [threadStatus, setThreadStatus] = useState('');

  useEffect(() => {
    if (user?.role !== 'student') {
      return;
    }

    const load = async () => {
      try {
        const [messagesResponse, notificationsResponse, conversationsResponse] = await Promise.all([
          fetchMessages(),
          fetchNotifications(),
          fetchConversations(),
        ]);

        setAllMessages(messagesResponse?.data || []);
        setLiveNotifications(notificationsResponse?.data || []);
        setConversationList(conversationsResponse?.data || []);
      } catch {
        setAllMessages([]);
        setLiveNotifications([]);
        setConversationList([]);
      }
    };

    load();
  }, [user?.role]);

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        if (user?.role === 'renter' || user?.role === 'admin') {
          const response = await fetchProperties();
          setProperties(response?.data || []);
        }

        if (user?.role === 'service_provider' || user?.role === 'admin') {
          const response = await fetchServices();
          setServices(response?.data || []);
        }

        if (user?.role === 'admin') {
          const response = await fetchAdminOverview();
          setAdminOverview(response?.data || null);
        }
      } catch {
        setProperties([]);
        setServices([]);
        setAdminOverview(null);
      }
    };

    loadRoleData();
  }, [user?.role]);

  const conversations = useMemo(() => {
    const map = new Map();

    conversationList.forEach((conversation) => {
      map.set(Number(conversation.id), {
        id: Number(conversation.id),
        name: conversation.name || `Conversation ${conversation.id}`,
        type: conversation.type,
      });
    });

    allMessages.forEach((message) => {
      const conversationId = Number(message.conversation_id);
      const existing = map.get(conversationId) || {
        id: conversationId,
        name: `Conversation ${conversationId}`,
        type: 'private',
      };

      map.set(conversationId, {
        ...existing,
        lastMessage: message.message,
        updatedAt: message.created_at,
        sender: message.sender_name || 'StayNest member',
      });
    });

    return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  }, [allMessages, conversationList]);

  const role = user?.role || 'student';
  const selectedConversationId = activeConversationId || conversations[0]?.id || null;

  useEffect(() => {
    if (user?.role !== 'student') {
      return;
    }

    const socket = connectSocket();
    if (selectedConversationId) {
      joinConversation(selectedConversationId);
    }

    const handleMessage = (message) => {
      if (Number(message.conversation_id) === Number(selectedConversationId)) {
        setThreadMessages((currentMessages) => {
          const exists = currentMessages.some((item) => item.id === message.id);
          return exists ? currentMessages : [...currentMessages, message].slice(-40);
        });
      }

      setAllMessages((currentMessages) => {
        const exists = currentMessages.some((item) => item.id === message.id);
        return exists ? currentMessages : [...currentMessages, message];
      });
    };

    const handleNotification = (notification) => {
      setLiveNotifications((currentNotifications) => [notification, ...currentNotifications].slice(0, 6));
    };

    socket.on('newMessage', handleMessage);
    socket.on('notification', handleNotification);

    return () => {
      socket.off('newMessage', handleMessage);
      socket.off('notification', handleNotification);
    };
  }, [selectedConversationId, user?.role]);

  useEffect(() => {
    const loadThread = async () => {
      if (!selectedConversationId) {
        return;
      }

      try {
        const response = await fetchMessagesByConversation(selectedConversationId);
        setThreadMessages(response?.data || []);
      } catch {
        setThreadMessages([]);
      }
    };

    loadThread();
  }, [selectedConversationId]);

  const ownProperties = properties.filter((property) => Number(property.owner_id) === Number(user?.id));
  const ownServices = services.filter((service) => Number(service.provider_id) === Number(user?.id));

  const renderStats = (stats) => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map(([label, value]) => (
        <article key={label} className="panel rounded-[1.5rem] p-5">
          <p className="text-sm muted-text">{label}</p>
          <p className="display-serif mt-3 text-5xl">{String(value).padStart(2, '0')}</p>
        </article>
      ))}
    </div>
  );

  if (role === 'renter') {
    return (
      <section className="space-y-8">
        <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="eyebrow">Renter dashboard</p>
          <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Manage your listings with less clutter.</h1>
          <p className="mt-4 max-w-2xl muted-text">Your renter pages now follow the same cleaner layout as the public experience.</p>
        </div>
        {renderStats([
          ['My listings', ownProperties.length],
          ['All properties', properties.length],
          ['Notifications', liveNotifications.length],
        ])}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="panel rounded-[2rem] p-6">
            <p className="eyebrow">Actions</p>
            <div className="mt-5 space-y-3">
              <Link to="/properties/new" className="primary-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">Add Property</Link>
              <Link to="/my-properties" className="outline-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">View my properties</Link>
              <Link to="/properties/requests" className="outline-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">Review requests</Link>
            </div>
          </section>
          <section className="panel rounded-[2rem] p-6">
            <p className="eyebrow">My properties</p>
            {!ownProperties.length ? (
              <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
                <h3 className="display-serif text-3xl">No properties yet</h3>
                <p className="mt-2 text-sm muted-text">Your property listings will appear here once created.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {ownProperties.slice(0, 4).map((property) => (
                  <article key={property.id} className="panel-muted rounded-[1.25rem] p-4">
                    <p className="font-semibold">{property.title}</p>
                    <p className="mt-1 text-sm muted-text">{property.location}</p>
                    <p className="mt-3 text-lg font-semibold">Rs {property.rent}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    );
  }

  if (role === 'service_provider') {
    return (
      <section className="space-y-8">
        <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="eyebrow">Service dashboard</p>
          <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Manage your services with a cleaner workspace.</h1>
          <p className="mt-4 max-w-2xl muted-text">Your provider pages now match the new minimal StayNest theme.</p>
        </div>
        {renderStats([
          ['My services', ownServices.length],
          ['All services', services.length],
          ['Notifications', liveNotifications.length],
        ])}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="panel rounded-[2rem] p-6">
            <p className="eyebrow">Actions</p>
            <div className="mt-5 space-y-3">
              <Link to="/services/new" className="primary-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">Add Service</Link>
              <Link to="/my-services" className="outline-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">View my services</Link>
              <Link to="/services/holders" className="outline-button block rounded-[1.25rem] px-4 py-4 text-sm font-semibold">Active service holders</Link>
            </div>
          </section>
          <section className="panel rounded-[2rem] p-6">
            <p className="eyebrow">My services</p>
            {!ownServices.length ? (
              <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
                <h3 className="display-serif text-3xl">No services yet</h3>
                <p className="mt-2 text-sm muted-text">Your service listings will appear here once created.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {ownServices.slice(0, 4).map((service) => (
                  <article key={service.id} className="panel-muted rounded-[1.25rem] p-4">
                    <p className="font-semibold">{service.title}</p>
                    <p className="mt-1 text-sm muted-text">{service.location}</p>
                    <p className="mt-3 text-lg font-semibold">Rs {service.price}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    );
  }

  if (role === 'admin') {
    const counts = adminOverview?.counts || {};

    return (
      <section className="space-y-8">
        <div className="panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="eyebrow">Admin dashboard</p>
          <h1 className="display-serif mt-4 text-5xl sm:text-6xl">Monitor the platform from one clear control surface.</h1>
          <p className="mt-4 max-w-2xl muted-text">Users, listings, posts, and reports stay visible without the old visual noise.</p>
        </div>
        {renderStats([
          ['Total users', counts.totalUsers || 0],
          ['Total listings', counts.totalListings || 0],
          ['Total posts', counts.totalPosts || 0],
        ])}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Users', '/admin/users'],
            ['Listings', '/admin/listings'],
            ['Posts', '/admin/posts'],
            ['Reports', '/admin/reports'],
          ].map(([title, href]) => (
            <Link key={title} to={href} className="panel rounded-[1.75rem] p-6 hover:-translate-y-1">
              <p className="eyebrow">Open</p>
              <h2 className="display-serif mt-3 text-3xl">{title}</h2>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageDraft.trim() || !activeConversationId) {
      return;
    }

    try {
      await sendConversationMessage({ conversation_id: activeConversationId, message: messageDraft });
      setMessageDraft('');
      const response = await fetchMessagesByConversation(activeConversationId);
      setThreadMessages(response?.data || []);
    } catch {
      // socket updates keep the thread moving
    }
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();
    const memberIds = conversationMembers.split(',').map((item) => Number(item.trim())).filter(Boolean);
    if (!memberIds.length) {
      setThreadStatus('Add at least one member ID.');
      return;
    }

    try {
      const response = await createConversation({ type: 'private', name: conversationName.trim() || null, member_ids: memberIds });
      const conversation = response?.data;
      if (conversation?.id) {
        setThreadStatus('Thread created successfully.');
        setConversationList((current) => [conversation, ...current]);
        setActiveConversationId(conversation.id);
        joinConversation(conversation.id);
        navigate('/dashboard', { state: { conversationId: conversation.id } });
      }
    } catch (error) {
      setThreadStatus(error.response?.data?.message || 'Unable to create thread right now.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="eyebrow">Student dashboard</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="display-serif text-3xl sm:text-4xl lg:text-6xl">Your student workspace now feels cleaner and more focused.</h1>
            <p className="mt-4 max-w-2xl muted-text">Messages, notifications, and active threads stay here without the previous cluttered feel.</p>
          </div>
          <div className="panel-muted rounded-[1.75rem] p-5">
            <p className="text-sm muted-text">Signed in as</p>
            <p className="display-serif mt-2 text-4xl">{user?.name || 'Student'}</p>
          </div>
        </div>
      </div>

      {renderStats([
        ['Active threads', conversations.length],
        ['Messages', threadMessages.length],
        ['Notifications', liveNotifications.length],
      ])}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="panel rounded-[2rem] p-6">
          <p className="eyebrow">Conversations</p>
          <form className="mt-5 space-y-3" onSubmit={handleCreateThread}>
            <input type="text" value={conversationName} onChange={(event) => setConversationName(event.target.value)} placeholder="Thread name" className="field" />
            <input type="text" value={conversationMembers} onChange={(event) => setConversationMembers(event.target.value)} placeholder="Member IDs, comma separated" className="field" />
            <button type="submit" className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold">Create new thread</button>
            {threadStatus ? <p className="panel-muted rounded-[1.25rem] px-4 py-3 text-sm muted-text">{threadStatus}</p> : null}
          </form>

          <div className="mt-6 space-y-3">
            {conversations.length ? conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={async () => {
                  setActiveConversationId(conversation.id);
                  joinConversation(conversation.id);
                  try {
                    const response = await fetchMessagesByConversation(conversation.id);
                    setThreadMessages(response?.data || []);
                  } catch {
                    setThreadMessages([]);
                  }
                }}
                className={`w-full rounded-[1.25rem] px-4 py-4 text-left ${Number(activeConversationId) === Number(conversation.id) ? 'primary-button' : 'panel-muted'}`}
              >
                <span className="block font-semibold">{conversation.name}</span>
                <span className="mt-1 block text-xs opacity-70">{conversation.sender || 'StayNest member'}{conversation.lastMessage ? `: ${conversation.lastMessage}` : ''}</span>
              </button>
            )) : (
              <div className="empty-state rounded-[1.25rem] p-6 text-center">
                <p className="display-serif text-2xl sm:text-3xl">No threads yet</p>
              </div>
            )}
          </div>
        </section>

        <section className="panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Thread</p>
              <h2 className="display-serif mt-2 text-2xl sm:text-3xl">Conversation</h2>
            </div>
            <div className="panel-muted rounded-full px-4 py-2 text-sm font-semibold">
              {activeConversationId ? `#${activeConversationId}` : 'No thread selected'}
            </div>
          </div>

          {!threadMessages.length ? (
            <div className="empty-state mt-6 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-2xl sm:text-3xl">No messages yet</h3>
              <p className="mt-2 text-sm muted-text">Your active thread will appear here once messages are available.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {threadMessages.map((message) => (
                <article key={message.id} className="panel-muted rounded-[1.25rem] p-4">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] faint-text">
                    <span>{message.sender_name || 'Sender'}</span>
                    <span>Conversation {message.conversation_id}</span>
                  </div>
                  <p className="mt-3">{message.message}</p>
                </article>
              ))}
            </div>
          )}

          <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSendMessage}>
            <input type="text" value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} placeholder="Write a message" className="field rounded-full" />
            <button type="submit" className="primary-button rounded-full px-5 py-3 text-sm font-semibold">Send</button>
          </form>
        </section>
      </div>
    </section>
  );
}

export default DashboardPage;
