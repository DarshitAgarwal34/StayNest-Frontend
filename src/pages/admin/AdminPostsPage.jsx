import { useEffect, useState } from 'react';

import { deleteAdminPost, fetchAdminPosts } from '../../api/api';

function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchAdminPosts();
        setPosts(response?.data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (postId) => {
    await deleteAdminPost(postId);
    setPosts((current) => current.filter((post) => post.id !== postId));
  };

  return (
    <section className="space-y-8">
      <div className="soft-panel rounded-[2.25rem] px-6 py-8 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#b45309]">Admin</p>
        <h1 className="display-serif mt-4 text-5xl text-[#102a43] sm:text-6xl">
          Total posts
        </h1>
        <p className="mt-4 max-w-2xl text-[#52606d]">
          Review community posts and remove content when necessary.
        </p>
      </div>

      {loading ? (
        <div className="soft-panel rounded-[1.75rem] p-10 text-center text-[#52606d]">
          Loading posts...
        </div>
      ) : !posts.length ? (
        <div className="empty-state rounded-[1.75rem] p-12 text-center">
          <h2 className="display-serif text-4xl text-[#102a43]">Coming Soon</h2>
          <p className="mt-3 text-[#52606d]">No posts are available yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="soft-panel rounded-[1.5rem] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b45309]">
                    {post.user?.name || 'Member'}
                  </p>
                  <p className="mt-2 text-[#102a43]">{post.content}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  className="rounded-full bg-[#b45309] px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminPostsPage;
