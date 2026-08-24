import { useState, useEffect, useCallback, useRef } from 'react';
import { Topic, TopicStatus, SyncMessage } from './types';

// API request helper
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `网络请求异常 (${res.status})`);
  }

  return res.json();
}

export async function fetchTopics(): Promise<Topic[]> {
  const data = await request<{ success: boolean; topics: Topic[] }>('/api/topics');
  return data.topics;
}

export async function createTopic(content: string, creator: string): Promise<Topic> {
  const data = await request<{ success: boolean; topic: Topic }>('/api/topics', {
    method: 'POST',
    body: JSON.stringify({ content, creator }),
  });
  return data.topic;
}

export async function updateTopicStatus(id: string, status: TopicStatus): Promise<Topic> {
  const data = await request<{ success: boolean; topic: Topic }>(`/api/topics/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.topic;
}

// Custom React hook for live real-time topics
export function useRealtimeTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Manual refresh fallback
  const refresh = useCallback(async () => {
    try {
      const data = await fetchTopics();
      setTopics(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch topics:', err);
      setError(err.message || '加载话题失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up SSE listener
  useEffect(() => {
    let isMounted = true;

    function connectSSE() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setSyncStatus('connected');
      const es = new EventSource('/api/events');
      eventSourceRef.current = es;

      es.onopen = () => {
        if (!isMounted) return;
        setSyncStatus('connected');
        setError(null);
      };

      es.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data: SyncMessage = JSON.parse(event.data);
          if (data && Array.isArray(data.topics)) {
            setTopics(data.topics);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error parsing SSE message:', err);
        }
      };

      es.onerror = () => {
        if (!isMounted) return;
        setSyncStatus('reconnecting');
        es.close();

        // Retry connection after 3 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            connectSSE();
            refresh();
          }
        }, 3000);
      };
    }

    // Initial fetch + connect SSE
    refresh();
    connectSSE();

    // Re-verify on page visible (e.g. user unlocked phone screen)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
        if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
          connectSSE();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [refresh]);

  // Derived statistics
  const pendingTopics = topics.filter((t) => t.status === 'pending');
  const discussedTopics = topics.filter((t) => t.status === 'discussed');
  const pendingCount = pendingTopics.length;
  const discussedCount = discussedTopics.length;

  return {
    topics,
    pendingTopics,
    discussedTopics,
    pendingCount,
    discussedCount,
    loading,
    syncStatus,
    error,
    refresh,
  };
}
