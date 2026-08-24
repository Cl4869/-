import React, { useState, useEffect } from 'react';
import { useRealtimeTopics, createTopic, updateTopicStatus } from './api';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { ActionButtons } from './components/ActionButtons';
import { TopicListSection } from './components/TopicListSection';
import { AddTopicModal } from './components/AddTopicModal';
import { RandomDrawModal } from './components/RandomDrawModal';
import { IdentitySelectorModal } from './components/IdentitySelectorModal';
import { TopicStatus } from './types';
import { Loader2 } from 'lucide-react';

export default function App() {
  // Identity preference stored locally per browser/device
  const [identity, setIdentity] = useState<string>(() => {
    return localStorage.getItem('partner_space_identity') || '乐乐';
  });

  // Modal open states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRandomOpen, setIsRandomOpen] = useState(false);
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);

  // Realtime topics sync hook
  const {
    topics,
    pendingTopics,
    pendingCount,
    discussedCount,
    loading,
    syncStatus,
    error,
    refresh,
  } = useRealtimeTopics();

  // Save identity changes
  const handleSelectIdentity = (newIdentity: string) => {
    setIdentity(newIdentity);
    localStorage.setItem('partner_space_identity', newIdentity);
  };

  // Add new topic handler
  const handleAddTopic = async (content: string, creator: string) => {
    await createTopic(content, creator);
  };

  // Toggle status handler (pending <-> discussed)
  const handleToggleStatus = async (id: string, currentStatus: TopicStatus) => {
    const nextStatus: TopicStatus = currentStatus === 'pending' ? 'discussed' : 'pending';
    await updateTopicStatus(id, nextStatus);
  };

  // Mark as discussed directly from Random modal
  const handleMarkDiscussed = async (id: string) => {
    await updateTopicStatus(id, 'discussed');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2721] font-sans antialiased selection:bg-[#E2D5C3] selection:text-[#2D2721] pb-12 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <Header
          currentIdentity={identity}
          onOpenIdentityModal={() => setIsIdentityOpen(true)}
          syncStatus={syncStatus}
        />

        {/* Main Content Area */}
        <main className="w-full">
          {loading && topics.length === 0 ? (
            <div className="w-full max-w-xl mx-auto py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#8A7964]" />
              <p className="text-xs text-[#8A7964]">正在连接两人的专属空间...</p>
            </div>
          ) : (
            <>
              {/* Stats Card: 我们还有 XX 个话题没有聊 */}
              <StatsCard
                pendingCount={pendingCount}
                discussedCount={discussedCount}
              />

              {/* Action Buttons: ＋ 添加一个话题 & 🎲 随机抽一个 */}
              <ActionButtons
                onOpenAddModal={() => setIsAddOpen(true)}
                onOpenRandomModal={() => setIsRandomOpen(true)}
                pendingCount={pendingCount}
              />

              {/* Topics Record List */}
              <TopicListSection
                topics={topics}
                onToggleStatus={handleToggleStatus}
                onOpenAddModal={() => setIsAddOpen(true)}
              />
            </>
          )}
        </main>
      </div>

      {/* Footer Note */}
      <footer className="w-full text-center py-6 text-xs text-[#A89E90]">
        <span>下次见面聊 · 属于两个人的私密灵感空间</span>
      </footer>

      {/* Modals */}
      <AddTopicModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddTopic}
        currentIdentity={identity}
      />

      <RandomDrawModal
        isOpen={isRandomOpen}
        onClose={() => setIsRandomOpen(false)}
        pendingTopics={pendingTopics}
        onMarkAsDiscussed={handleMarkDiscussed}
      />

      <IdentitySelectorModal
        isOpen={isIdentityOpen}
        currentIdentity={identity}
        onSelectIdentity={handleSelectIdentity}
        onClose={() => setIsIdentityOpen(false)}
      />
    </div>
  );
}
