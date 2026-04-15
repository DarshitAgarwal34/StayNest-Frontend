import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createPost, fetchPosts, joinConversationThread } from '../api/api';
import { connectSocket } from '../socket';

function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    content: '',
    type: 'general',
  });
  const [submitState, setSubmitState] = useState({
    loading: false,
    message: '',
    error: '',
  });

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response?.data || []);
      } catch {
        setPosts([]);
      }
    };

    loadPosts();

    const socket = connectSocket();
    const handleNewPost = (incomingPost) => {
      setPosts((currentPosts) => {
        const exists = currentPosts.some((post) => post.id === incomingPost.id);
        return exists ? currentPosts : [incomingPost, ...currentPosts];
      });
    };

    socket.on('newPost', handleNewPost);

    return () => {
      socket.off('newPost', handleNewPost);
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ loading: true, message: '', error: '' });

    try {
      const response = await createPost(formData);
      const createdPost = response?.data;

      if (createdPost?.id) {
        setPosts((currentPosts) => {
          const exists = currentPosts.some((post) => post.id === createdPost.id);
          return exists ? currentPosts : [createdPost, ...currentPosts];
        });
      }

      setSubmitState({ loading: false, message: 'Post created successfully.', error: '' });
      setFormData({ content: '', type: 'general' });
    } catch (apiError) {
      setSubmitState({
        loading: false,
        message: '',
        error: apiError.response?.data?.message || 'Unable to create post right now.',
      });
    }
  };

  const handleJoinThread = async (conversationId) => {
    try {
      await joinConversationThread(conversationId);
      navigate('/dashboard', { state: { conversationId } });
    } catch {
      setSubmitState({ loading: false, message: '', error: 'Unable to join this thread right now.' });
    }
  };

  return (
    <section className="space-y-8">
      <div className="panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="eyebrow">Community</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="display-serif text-3xl sm:text-5xl lg:text-6xl">
              The shared noticeboard continues to connect the community with a refined experience.
            </h1>
            <p className="mt-4 max-w-2xl muted-text">
              PDiscover updates, rental opportunities, service announcements, and local discussions within a more structured and polished environment.
            </p>
          </div>
          <div className="panel-muted rounded-[1.75rem] p-5">
            <p className="text-sm muted-text">Live feed</p>
            <p className="display-serif mt-2 text-4xl">{String(posts.length).padStart(2, '0')}</p>
            <p className="mt-2 text-sm muted-text">Posts are refreshed from the backend and socket feed.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {!posts.length ? (
            <article className="empty-state rounded-[1.75rem] p-10 text-center">
              <h2 className="display-serif text-2xl sm:text-3xl">No posts yet</h2>
              <p className="mt-3 muted-text">Be the first to share an update.</p>
            </article>
          ) : null}

          {posts.map((post, index) => (
            <article
              key={post.id ?? `${post.content}-${index}`}
              className="panel-strong rounded-[1.75rem] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="eyebrow">{post.type || 'General'}</p>
                  <p className="mt-2 text-lg font-semibold">{post.user?.name || post.user_name || 'StayNest member'}</p>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold faint-text">
                  Thread {post.thread_id ? `#${post.thread_id}` : 'pending'}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 muted-text">{post.content}</p>
              {post.thread_id ? (
                <button
                  type="button"
                  onClick={() => handleJoinThread(post.thread_id)}
                  className="outline-button mt-5 rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Open thread
                </button>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="panel rounded-[1.75rem] p-5 sm:p-6">
          <p className="eyebrow">Create post</p>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <textarea
              name="content"
              placeholder="Share an update with the community"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="field-area"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="field-select"
            >
              <option value="general">General</option>
              <option value="roommate">Roommate</option>
              <option value="service">Service</option>
            </select>
            {submitState.message ? <p className="message-success rounded-[1.25rem] px-4 py-3 text-sm font-medium">{submitState.message}</p> : null}
            {submitState.error ? <p className="message-error rounded-[1.25rem] px-4 py-3 text-sm font-medium">{submitState.error}</p> : null}
            <button type="submit" disabled={submitState.loading} className="primary-button w-full rounded-full px-5 py-3 text-sm font-semibold">
              {submitState.loading ? 'Posting...' : 'Create Post'}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

export default CommunityPage;
