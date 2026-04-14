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
        setPosts(
          (response?.data || []).map((post) => ({
            id: post.id,
            thread_id: post.thread_id,
            title:
              post.type === 'roommate'
                ? 'Roommate update'
                : post.type === 'service'
                  ? 'Service update'
                  : 'Community update',
            type: post.type || 'general',
            author: post.user?.name || post.user_name || 'StayNest member',
            excerpt: post.content,
          }))
        );
      } catch {
        setPosts([]);
      }
    };

    loadPosts();

    const socket = connectSocket();
    const handleNewPost = (incomingPost) => {
      setPosts((currentPosts) => {
        const normalizedPost = {
          id: incomingPost.id,
          thread_id: incomingPost.thread_id,
          title:
            incomingPost.type === 'roommate'
              ? 'Roommate update'
              : incomingPost.type === 'service'
                ? 'Service update'
                : 'Community update',
          type: incomingPost.type || 'general',
          author: incomingPost.user?.name || incomingPost.user_name || 'StayNest member',
          excerpt: incomingPost.content || 'A new update was shared with the community.',
        };

        const exists = currentPosts.some((post) => post.id === normalizedPost.id);
        return exists ? currentPosts : [normalizedPost, ...currentPosts];
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
          if (exists) {
            return currentPosts;
          }

          return [
            {
              id: createdPost.id,
              thread_id: createdPost.thread_id,
              title:
                createdPost.type === 'roommate'
                  ? 'Roommate update'
                  : createdPost.type === 'service'
                    ? 'Service update'
                    : 'Community update',
              type: createdPost.type || 'general',
              author: createdPost.user?.name || createdPost.user_name || 'StayNest member',
              excerpt: createdPost.content,
            },
            ...currentPosts,
          ];
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
      setSubmitState({
        loading: false,
        message: '',
        error: 'Unable to join this thread right now.',
      });
    }
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
          Community
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="display-serif text-3xl text-[#102a43] sm:text-5xl lg:text-6xl">
              The shared noticeboard for daily living.
            </h1>
            <p className="mt-4 max-w-2xl text-[#52606d]">
              Posts, quick help, rental leads, and neighborhood updates all live in one calm social layer.
            </p>
          </div>
          <div className="page-chip rounded-[1.5rem] px-4 py-3 text-sm font-semibold text-[#102a43] sm:px-5 sm:py-4">
            Real-time posts from the backend and socket feed
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {!posts.length ? (
            <article className="empty-state rounded-[1.75rem] p-10 text-center">
              <h2 className="display-serif text-2xl text-[#102a43] sm:text-3xl">Coming Soon</h2>
              <p className="mt-3 text-[#52606d]">Be the first to post.</p>
            </article>
          ) : null}

          {posts.map((post, index) => (
            <article
              key={post.id ?? `${post.title}-${index}`}
              className="rounded-[1.75rem] border border-[#102a43]/8 bg-white p-6 shadow-[0_16px_35px_rgba(16,42,67,0.06)]"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#829ab1]">
                Posted by {post.author}
              </p>
              <h2 className="display-serif mt-3 text-2xl text-[#102a43] sm:text-3xl">{post.title}</h2>
              <p className="mt-3 text-[#52606d]">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#f1ece2] px-4 py-2 text-xs font-semibold text-[#102a43]">
                  Thread {post.thread_id ? `#${post.thread_id}` : 'pending'}
                </span>
                {post.thread_id ? (
                  <button
                    type="button"
                    onClick={() => handleJoinThread(post.thread_id)}
                    className="rounded-full bg-[#102a43] px-4 py-2 text-sm font-semibold text-[#f7f1e8]"
                  >
                    Open thread
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <aside className="soft-panel rounded-[1.75rem] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">
            Create post
          </p>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <textarea
              name="content"
              placeholder="Share an update with the community"
              value={formData.content}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-[1.25rem] border border-[#102a43]/10 bg-white px-4 py-3 outline-none transition focus:border-[#b45309]"
            >
              <option value="general">General</option>
              <option value="roommate">Roommate</option>
              <option value="service">Service</option>
            </select>
            {submitState.message ? (
              <p className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {submitState.message}
              </p>
            ) : null}
            {submitState.error ? (
              <p className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {submitState.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitState.loading}
              className="w-full rounded-full bg-[#102a43] px-5 py-3 text-sm font-semibold text-[#f7f1e8] transition hover:bg-[#0b1f33]"
            >
              {submitState.loading ? 'Posting...' : 'Create Post'}
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

export default CommunityPage;
