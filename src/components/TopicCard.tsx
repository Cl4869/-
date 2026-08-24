import React, { useState } from 'react';
import { User, Calendar, CheckCircle2, CircleDot, Clock, Check } from 'lucide-react';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  onToggleStatus: (id: string, currentStatus: 'pending' | 'discussed') => Promise<void>;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onToggleStatus }) => {
  const [loading, setLoading] = useState(false);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(
        d.getDate()
      ).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      await onToggleStatus(topic.id, topic.status);
    } catch (err) {
      console.error('Failed to toggle topic status:', err);
    } finally {
      setLoading(false);
    }
  };

  const isDiscussed = topic.status === 'discussed';

  return (
    <div
      className={`relative w-full rounded-2xl p-5 sm:p-6 transition-all border ${
        isDiscussed
          ? 'bg-[#F2ECE2]/60 border-[#DFD6C7] opacity-80'
          : 'bg-[#FFFFFF] border-[#E2D8CA] shadow-2xs hover:shadow-xs'
      }`}
    >
      {/* Top row: Status Tag & Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isDiscussed
              ? 'bg-[#E7F3E8] text-[#2F6B38] border-[#C8E4CB]'
              : 'bg-[#FEF5E7] text-[#9A6209] border-[#F8DCB0]'
          }`}
        >
          {isDiscussed ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D8C47]" />
              <span>已聊</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              <span>未聊</span>
            </>
          )}
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
            isDiscussed
              ? 'text-[#7D7262] hover:bg-[#E7E0D3] hover:text-[#3B3329]'
              : 'text-[#42392E] bg-[#F1E9DC] hover:bg-[#E5DC CD] border border-[#DDD3C2]'
          }`}
          title={isDiscussed ? '恢复为未聊' : '标记为已聊'}
        >
          {isDiscussed ? (
            <span>撤回为未聊</span>
          ) : (
            <>
              <Check className="w-3.5 h-3.5 text-[#5C4F40]" />
              <span>标记为已聊</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <p
        className={`text-base leading-relaxed whitespace-pre-wrap ${
          isDiscussed ? 'text-[#635C52] line-through decoration-[#B5A898]' : 'text-[#2B251F]'
        }`}
      >
        {topic.content}
      </p>

      {/* Meta Footer */}
      <div className="mt-4 pt-3 border-t border-[#F0E9DF] flex items-center justify-between text-xs text-[#8A7F6F]">
        <div className="flex items-center gap-1.5 font-medium text-[#4C4235]">
          <User className="w-3.5 h-3.5 text-[#8F7D67]" />
          <span>{topic.creator}</span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(topic.created_at)}</span>
        </div>
      </div>
    </div>
  );
};
