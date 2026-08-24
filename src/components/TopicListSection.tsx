import React, { useState } from 'react';
import { Topic, TopicTab } from '../types';
import { TopicCard } from './TopicCard';
import { Sparkles, MessageCircle, Clock, CheckCircle } from 'lucide-react';

interface TopicListSectionProps {
  topics: Topic[];
  onToggleStatus: (id: string, currentStatus: 'pending' | 'discussed') => Promise<void>;
  onOpenAddModal: () => void;
}

export const TopicListSection: React.FC<TopicListSectionProps> = ({
  topics,
  onToggleStatus,
  onOpenAddModal,
}) => {
  const [activeTab, setActiveTab] = useState<TopicTab>('pending');

  const pendingTopics = topics.filter((t) => t.status === 'pending');
  const discussedTopics = topics.filter((t) => t.status === 'discussed');

  const filteredTopics =
    activeTab === 'pending'
      ? pendingTopics
      : activeTab === 'discussed'
      ? discussedTopics
      : topics;

  return (
    <section className="w-full max-w-xl mx-auto px-4 mt-6 mb-16">
      {/* Section Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-[#E8E0D2]">
        <h3 className="text-base font-serif font-medium text-[#2E2720] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#8C7A65]" />
          <span>话题记录</span>
        </h3>

        {/* Tab Filters */}
        <div className="inline-flex p-1 rounded-xl bg-[#EFE8DC] border border-[#DDD3C2] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#3D352B] text-[#FAF7F2] shadow-2xs'
                : 'text-[#635747] hover:text-[#2E2720]'
            }`}
          >
            未聊 ({pendingTopics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('discussed')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'discussed'
                ? 'bg-[#3D352B] text-[#FAF7F2] shadow-2xs'
                : 'text-[#635747] hover:text-[#2E2720]'
            }`}
          >
            已聊 ({discussedTopics.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#3D352B] text-[#FAF7F2] shadow-2xs'
                : 'text-[#635747] hover:text-[#2E2720]'
            }`}
          >
            全部 ({topics.length})
          </button>
        </div>
      </div>

      {/* Topics Stream */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-3.5">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} onToggleStatus={onToggleStatus} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#FAF6F0]/80 border border-dashed border-[#DDD2C2]">
          <div className="w-12 h-12 rounded-full bg-[#EFE8DC] text-[#7A6A55] flex items-center justify-center mx-auto mb-3">
            {activeTab === 'discussed' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <MessageCircle className="w-5 h-5" />
            )}
          </div>
          <p className="text-sm font-medium text-[#4A4033] mb-1">
            {activeTab === 'pending'
              ? '所有话题都聊完啦！'
              : activeTab === 'discussed'
              ? '还没有标记为已聊的话题'
              : '还没有添加任何话题'}
          </p>
          <p className="text-xs text-[#8A7F6E] mb-4">
            {activeTab === 'pending'
              ? '平时线上想到什么事情，随时记录下来～'
              : '聊完的话题会作为两人的回忆好好保留在这里。'}
          </p>
          {activeTab === 'pending' && (
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-[#3D352B] hover:bg-[#2A231B] text-[#FAF7F2] text-xs font-medium rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>+ 添加新话题</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
