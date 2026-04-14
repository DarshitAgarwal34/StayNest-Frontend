import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  createConversation,
  fetchConversations,
  fetchAdminOverview,
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
  const [activeConversationId, setActiveConversationId] = useState(
    () => Number(location.state?.conversationId) || null
  );
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

      const next = {
        ...existing,
        lastMessage: message.message,
        updatedAt: message.created_at,
        sender: message.sender_name || 'StayNest member',
      };

      map.set(conversationId, next);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );
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
      setLiveNotifications((currentNotifications) => [
        notification,
        ...currentNotifications,
      ].slice(0, 6));
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

  const cards = [
    { label: 'Active threads', value: String(conversations.length).padStart(2, '0') },
    { label: 'Messages', value: String(threadMessages.length).padStart(2, '0') },
    { label: 'Notifications', value: String(liveNotifications.length).padStart(2, '0') },
  ];

  const ownProperties = properties.filter((property) => Number(property.owner_id) === Number(user?.id));
  const ownServices = services.filter((service) => Number(service.provider_id) === Number(user?.id));

  if (role === 'renter') {
    return (
      <section className="space-y-8">
        <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Dashboard</p>
          <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
            Renter workspace
          </h1>
          <p className="mt-4 max-w-2xl text-[#52606d]">
            Manage your listings, requests, and active properties without any chat-thread clutter.
          </p>
        </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-[1.5rem] bg-[#102a43] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">My listings</p>
            <p className="mt-4 display-serif text-5xl">{String(ownProperties.length).padStart(2, '0')}</p>
          </article>
          <article className="rounded-[1.5rem] bg-[#b45309] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Properties</p>
            <p className="mt-4 display-serif text-5xl">{String(properties.length).padStart(2, '0')}</p>
          </article>
          <article className="rounded-[1.5rem] bg-[#6b8e72] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Notifications</p>
            <p className="mt-4 display-serif text-5xl">{String(liveNotifications.length).padStart(2, '0')}</p>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="soft-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Action</p>
                <h2 className="display-serif mt-2 text-3xl text-[#102a43]">Publish a property</h2>
              </div>
              <Link to="/properties/new" className="rounded-full bg-[#102a43] px-5 py-3 text-center text-sm font-semibold text-[#f7f1e8] sm:text-left">
                Add Property
              </Link>
            </div>

            <div className="mt-6 space-y-3">
                <Link to="/my-properties" className="block rounded-[1.25rem] bg-white px-4 py-4 font-semibold text-[#102a43]">
                  View my properties
                </Link>
              <Link to="/properties/requests" className="block rounded-[1.25rem] bg-white px-4 py-4 font-semibold text-[#102a43]">
                Review requests
              </Link>
              <Link to="/properties/summary" className="block rounded-[1.25rem] bg-white px-4 py-4 font-semibold text-[#102a43]">
                View total listings
              </Link>
            </div>
          </section>

          <section className="soft-panel rounded-[2rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">My Properties</p>
            {!ownProperties.length ? (
              <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
                <h3 className="display-serif text-3xl">Coming Soon</h3>
                <p className="mt-2 text-sm text-[#52606d]">Your property listings will appear here once created.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {ownProperties.map((property) => (
                  <article key={property.id} className="rounded-[1.25rem] bg-white p-4">
                    <p className="font-semibold text-[#102a43]">{property.title}</p>
                    <p className="mt-1 text-sm text-[#52606d]">{property.location}</p>
                    <p className="mt-3 text-lg font-black text-[#b45309]">Rs {property.rent}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="soft-panel rounded-[2rem] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Live notifications</p>
          {!liveNotifications.length ? (
            <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-3xl">Coming Soon</h3>
              <p className="mt-2 text-sm text-[#52606d]">Notifications will appear here in real time.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {liveNotifications.map((notification) => (
                <article key={notification.id} className="rounded-[1.25rem] bg-white p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b45309]">{notification.type || 'Update'}</p>
                  <p className="mt-2 text-sm text-[#102a43]">{notification.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    );
  }

  if (role === 'service_provider') {
    return (
      <section className="space-y-8">
        <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Dashboard</p>
          <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
            Service provider workspace
          </h1>
          <p className="mt-4 max-w-2xl text-[#52606d]">
            Publish services, track your listings, and handle incoming interest without thread screens.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-[1.5rem] bg-[#102a43] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">My services</p>
            <p className="mt-4 display-serif text-5xl">{String(ownServices.length).padStart(2, '0')}</p>
          </article>
          <article className="rounded-[1.5rem] bg-[#d97706] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Services</p>
            <p className="mt-4 display-serif text-5xl">{String(services.length).padStart(2, '0')}</p>
          </article>
          <article className="rounded-[1.5rem] bg-[#6b8e72] p-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">Notifications</p>
            <p className="mt-4 display-serif text-5xl">{String(liveNotifications.length).padStart(2, '0')}</p>
          </article>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="soft-panel rounded-[2rem] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Action</p>
                <h2 className="display-serif mt-2 text-3xl text-[#102a43]">Publish a service</h2>
              </div>
              <Link to="/services/new" className="rounded-full bg-[#102a43] px-5 py-3 text-center text-sm font-semibold text-[#f7f1e8] sm:text-left">
                Add Service
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              <Link to="/my-services" className="block rounded-[1.25rem] bg-white px-4 py-4 font-semibold text-[#102a43]">
                View my services
              </Link>
              <Link to="/services/holders" className="block rounded-[1.25rem] bg-white px-4 py-4 font-semibold text-[#102a43]">
                Active service holders
              </Link>
            </div>
          </section>

          <section className="soft-panel rounded-[2rem] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">My Services</p>
            {!ownServices.length ? (
              <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
                <h3 className="display-serif text-3xl">Coming Soon</h3>
                <p className="mt-2 text-sm text-[#52606d]">Your service listings will appear here once created.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {ownServices.map((service) => (
                  <article key={service.id} className="rounded-[1.25rem] bg-white p-4">
                    <p className="font-semibold text-[#102a43]">{service.title}</p>
                    <p className="mt-1 text-sm text-[#52606d]">{service.location}</p>
                    <p className="mt-3 text-lg font-black text-[#b45309]">Rs {service.price}</p>
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
        <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Dashboard</p>
          <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
            Admin control room
          </h1>
          <p className="mt-4 max-w-2xl text-[#52606d]">
            Monitor users, listings, posts, and moderation signals from a single live dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total users', counts.totalUsers || 0],
            ['Total listings', counts.totalListings || 0],
            ['Total posts', counts.totalPosts || 0],
            ['Unread alerts', counts.unreadNotifications || 0],
          ].map(([label, value], index) => (
            <article key={label} className={`rounded-[1.5rem] p-5 text-white ${index % 2 === 0 ? 'bg-[#102a43]' : 'bg-[#b45309]'}`}>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">{label}</p>
              <p className="mt-4 display-serif text-5xl">{String(value).padStart(2, '0')}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            ['Manage Students', counts.students || 0, '/admin/users'],
            ['Manage Renters', counts.renters || 0, '/admin/users'],
            ['Manage Services', counts.serviceProviders || 0, '/admin/users'],
            ['Content Moderation', counts.totalComments || 0, '/admin/posts'],
            ['Remove fake posts', counts.totalPosts || 0, '/admin/posts'],
            ['Handle complaints', counts.unreadNotifications || 0, '/admin/reports'],
          ].map(([title, count, href]) => (
            <article key={title} className="soft-panel rounded-[1.75rem] p-6">
              <h2 className="display-serif text-3xl text-[#102a43]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#52606d]">Current count: {count}</p>
              <Link to={href} className="mt-4 inline-flex rounded-full bg-[#102a43] px-4 py-2 text-sm font-semibold text-[#f7f1e8]">
                Open
              </Link>
            </article>
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
      await sendConversationMessage({
        conversation_id: activeConversationId,
        message: messageDraft,
      });
      setMessageDraft('');
      const response = await fetchMessagesByConversation(activeConversationId);
      setThreadMessages(response?.data || []);
    } catch {
      // realtime socket path keeps the thread in sync
    }
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();

    const memberIds = conversationMembers
      .split(',')
      .map((item) => Number(item.trim()))
      .filter(Boolean);

    if (!memberIds.length) {
      setThreadStatus('Add at least one member ID.');
      return;
    }

    try {
      const response = await createConversation({
        type: 'private',
        name: conversationName.trim() || null,
        member_ids: memberIds,
      });

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
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
          Dashboard
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-3xl text-[#102a43] sm:text-4xl lg:text-6xl">
              Your space, threads, and updates in one calm board.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Quick messages, live notifications, and your active conversations all sit here without the clutter of a multi-panel app.
            </p>
          </div>
          <div className="page-chip rounded-[1.5rem] px-4 py-3 text-sm font-semibold text-[#102a43] sm:px-5 sm:py-4">
            {user?.name || 'Guest'}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`rounded-[1.5rem] p-5 text-white shadow-[0_18px_40px_rgba(16,42,67,0.12)] ${
              index === 0 ? 'bg-[#102a43]' : index === 1 ? 'bg-[#6b8e72]' : 'bg-[#d97706]'
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">{card.label}</p>
            <p className="mt-4 display-serif text-3xl sm:text-5xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="soft-panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
                Conversations
              </p>
              <h2 className="display-serif mt-2 text-2xl text-[#102a43] sm:text-3xl">
                Start or open a thread
              </h2>
            </div>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleCreateThread}>
            <input
              type="text"
              value={conversationName}
              onChange={(event) => setConversationName(event.target.value)}
              placeholder="Thread name"
              className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            />
            <input
              type="text"
              value={conversationMembers}
              onChange={(event) => setConversationMembers(event.target.value)}
              placeholder="Member IDs, comma separated"
              className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33]"
            >
              Create new thread
            </button>
            {threadStatus ? (
              <p className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-[#52606d]">{threadStatus}</p>
            ) : null}
          </form>

          <div className="mt-6 space-y-3">
            {conversations.length ? (
              conversations.map((conversation) => (
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
                  className={`flex w-full items-center justify-between rounded-[1.25rem] px-4 py-4 text-left transition ${
                    Number(activeConversationId) === Number(conversation.id)
                      ? 'bg-[#102a43] text-[#f7f1e8]'
                      : 'bg-white text-[#102a43] hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">{conversation.name}</span>
                    <span className="mt-1 block text-xs text-current/70">
                      {conversation.sender || 'StayNest member'}
                      {conversation.lastMessage ? `: ${conversation.lastMessage}` : ''}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] opacity-70">Open</span>
                </button>
              ))
            ) : (
              <div className="empty-state rounded-[1.25rem] p-6 text-center text-[#52606d]">
                <p className="display-serif text-2xl text-[#102a43] sm:text-3xl">Coming Soon</p>
                <p className="mt-2 text-sm">
                  Conversations will appear after you create a new thread or receive a message.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="soft-panel rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b8e72]">
                Thread
              </p>
              <h2 className="display-serif mt-2 text-2xl text-[#102a43] sm:text-3xl">
                Conversation-based chat
              </h2>
            </div>
            <div className="page-chip rounded-full px-4 py-2 text-sm font-semibold text-[#102a43]">
              {activeConversationId ? `#${activeConversationId}` : 'No thread selected'}
            </div>
          </div>

          {!threadMessages.length ? (
            <div className="empty-state mt-6 rounded-[1.5rem] p-8 text-center">
              <h3 className="display-serif text-2xl sm:text-3xl">Coming Soon</h3>
              <p className="mt-2 text-sm text-[#52606d]">
                Your active thread will appear here once messages are available.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {threadMessages.map((message) => (
                <article key={message.id} className="rounded-[1.25rem] bg-white p-4">
                  <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-[#829ab1]">
                    <span>{message.sender_name || 'Sender'}</span>
                    <span>Conversation {message.conversation_id}</span>
                  </div>
                  <p className="mt-3 text-[#102a43]">{message.message}</p>
                </article>
              ))}
            </div>
          )}

          <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={messageDraft}
              onChange={(event) => setMessageDraft(event.target.value)}
              placeholder="Write a message"
              className="rounded-full border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33] sm:w-auto w-full"
            >
              Send
            </button>
          </form>
        </section>
      </div>

      <section className="soft-panel rounded-[2rem] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          Live notifications
        </p>
        {!liveNotifications.length ? (
          <div className="empty-state mt-5 rounded-[1.5rem] p-8 text-center">
            <h3 className="display-serif text-2xl sm:text-3xl">Coming Soon</h3>
            <p className="mt-2 text-sm text-[#52606d]">
              Notifications will show up here in real time.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {liveNotifications.map((notification) => (
              <article key={notification.id} className="rounded-[1.25rem] bg-white p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b45309]">
                  {notification.type || 'Update'}
                </p>
                <p className="mt-2 text-sm text-[#102a43]">{notification.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default DashboardPage;
