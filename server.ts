import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'topics.json');

export interface Topic {
  id: string;
  content: string;
  creator: string;
  created_at: string;
  status: 'pending' | 'discussed';
  discussed_at?: string | null;
}

// Initial default topics to welcome the two friends
const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'topic_welcome_1',
    content: '如果可以重新选择一次大学专业，你还会选择现在这个吗？',
    creator: '乐乐',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'pending',
    discussed_at: null,
  },
  {
    id: 'topic_welcome_2',
    content: '下次见面我们去试一下街角那家新开的咖啡馆，顺便聊聊最近的生活。',
    creator: '朋友',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'pending',
    discussed_at: null,
  },
];

// Ensure data directory and file exist
function initStorage(): Topic[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_TOPICS, null, 2), 'utf-8');
    return DEFAULT_TOPICS;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading data file, resetting to default:', err);
  }
  return DEFAULT_TOPICS;
}

let topicsCache: Topic[] = initStorage();

// Safe async file writer
function saveTopics(topics: Topic[]) {
  topicsCache = topics;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(topics, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('Failed to save topics to disk:', err);
  }
}

// Active SSE client connections
interface SSEClient {
  id: number;
  res: express.Response;
}
let sseClients: SSEClient[] = [];
let nextClientId = 1;

function broadcastTopicsUpdate() {
  const payload = JSON.stringify({
    type: 'sync',
    timestamp: new Date().toISOString(),
    topics: topicsCache,
  });
  
  sseClients.forEach((client) => {
    try {
      client.res.write(`data: ${payload}\n\n`);
    } catch (err) {
      console.warn(`Failed to push SSE to client ${client.id}:`, err);
    }
  });
}

// Keep-alive heartbeat every 20 seconds
setInterval(() => {
  sseClients.forEach((client) => {
    try {
      client.res.write(`: heartbeat\n\n`);
    } catch {
      // client probably disconnected
    }
  });
}, 20000);

// --- API Endpoints ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. SSE stream for real-time synchronization
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = nextClientId++;
  const client: SSEClient = { id: clientId, res };
  sseClients.push(client);

  // Send initial data immediately
  const initialPayload = JSON.stringify({
    type: 'init',
    timestamp: new Date().toISOString(),
    topics: topicsCache,
  });
  res.write(`data: ${initialPayload}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// 3. Get all topics
app.get('/api/topics', (req, res) => {
  res.json({
    success: true,
    topics: topicsCache,
  });
});

// 4. Create a new topic
app.post('/api/topics', (req, res) => {
  const { content, creator } = req.body;

  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ success: false, message: '话题内容不能为空' });
  }

  const cleanContent = content.trim();
  const cleanCreator = (creator && typeof creator === 'string' && creator.trim()) || '朋友';

  const newTopic: Topic = {
    id: `topic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    content: cleanContent,
    creator: cleanCreator,
    created_at: new Date().toISOString(),
    status: 'pending',
    discussed_at: null,
  };

  // Add to top of array
  const updatedTopics = [newTopic, ...topicsCache];
  saveTopics(updatedTopics);

  // Broadcast to all active devices in real-time
  broadcastTopicsUpdate();

  return res.status(201).json({
    success: true,
    topic: newTopic,
  });
});

// 5. Update topic status (e.g. mark as discussed or back to pending)
app.patch('/api/topics/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'pending' && status !== 'discussed') {
    return res.status(400).json({ success: false, message: '无效的状态' });
  }

  const topicIndex = topicsCache.findIndex((t) => t.id === id);
  if (topicIndex === -1) {
    return res.status(404).json({ success: false, message: '未找到该话题' });
  }

  const existing = topicsCache[topicIndex];
  const updatedTopic: Topic = {
    ...existing,
    status,
    discussed_at: status === 'discussed' ? new Date().toISOString() : null,
  };

  const updatedTopics = [...topicsCache];
  updatedTopics[topicIndex] = updatedTopic;
  saveTopics(updatedTopics);

  // Broadcast update
  broadcastTopicsUpdate();

  return res.json({
    success: true,
    topic: updatedTopic,
  });
});

// --- Server & Vite Setup ---

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`「下次见面聊」Server running on port ${PORT}`);
  });
}

startServer();
