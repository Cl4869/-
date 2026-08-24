export type TopicStatus = 'pending' | 'discussed';

export interface Topic {
  id: string;
  content: string;
  creator: string;
  created_at: string;
  status: TopicStatus;
  discussed_at?: string | null;
}

export type TopicTab = 'all' | 'pending' | 'discussed';

export interface SyncMessage {
  type: 'init' | 'sync';
  timestamp: string;
  topics: Topic[];
}
