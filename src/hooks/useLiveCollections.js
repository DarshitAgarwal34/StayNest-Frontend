import { useEffect, useState } from 'react';

import { getStoredUser } from '../api/api';
import { connectSocket } from '../socket';

const localEventMap = {
  properties: 'staynest:properties-changed',
  services: 'staynest:services-changed',
  posts: 'staynest:posts-changed',
};

const notificationTypeMap = {
  properties: 'property',
  services: 'service',
};

export const emitCollectionChanged = (collection) => {
  const eventName = localEventMap[collection];
  if (eventName) {
    window.dispatchEvent(new Event(eventName));
  }
};

export function useLiveCollections(collection, fetcher, { limit, pollMs = 30000 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetcher();
        const nextItems = response?.data || [];

        if (!mounted) {
          return;
        }

        setItems(limit ? nextItems.slice(0, limit) : nextItems);
        setError('');
      } catch (apiError) {
        if (!mounted) {
          return;
        }

        setItems([]);
        setError(apiError?.response?.data?.message || '');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    const intervalId = window.setInterval(load, pollMs);

    const localEvent = localEventMap[collection];
    const handleLocalRefresh = () => load();
    if (localEvent) {
      window.addEventListener(localEvent, handleLocalRefresh);
    }

    const user = getStoredUser();
    let socket;
    let cleanupSocket = () => {};

    if (user) {
      socket = connectSocket();

      const handleNotification = (notification) => {
        if (notification?.type === notificationTypeMap[collection]) {
          load();
        }
      };

      const handlePost = () => {
        if (collection === 'posts') {
          load();
        }
      };

      socket.on('notification', handleNotification);
      socket.on('newPost', handlePost);

      cleanupSocket = () => {
        socket.off('notification', handleNotification);
        socket.off('newPost', handlePost);
      };
    }

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      cleanupSocket();
      if (localEvent) {
        window.removeEventListener(localEvent, handleLocalRefresh);
      }
    };
  }, [collection, fetcher, limit, pollMs]);

  return { items, loading, error };
}
