import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Sparkles } from 'lucide-react';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, creator: string) => Promise<void>;
  currentIdentity: string;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentIdentity,
}) => {
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState(currentIdentity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync creator with currentIdentity if opened
  React.useEffect(() => {
    if (isOpen) {
      setCreator(currentIdentity);
      setError(null);
    }
  }, [isOpen, currentIdentity]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('请输入想聊的话题内容');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(content.trim(), creator.trim() || '朋友');
      setContent('');
      onClose();
    } catch (err: any) {
      setError(err.message || '保存失败，请检查网络后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1F1B18]/45 backdrop-blur-xs"
        />

        {/* Modal Sheet / Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E5DDCF] z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D7]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#EFE8DC] flex items-center justify-center text-[#736450]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-medium text-[#2E2720] font-serif">
                添加一个话题
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#8A8174] hover:text-[#2E2720] p-1.5 rounded-full hover:bg-[#EFE8DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            {/* Identity badge */}
            <div className="flex items-center justify-between text-xs text-[#7A7061] px-1">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8C7A65]" />
                发起人：
                <strong className="text-[#383027] font-medium">{creator}</strong>
              </span>
              <span className="text-[#A3998C]">保存后两个人都能看到</span>
            </div>

            {/* Content Textarea */}
            <div>
              <label htmlFor="topic-content" className="sr-only">
                想和对方聊什么？
              </label>
              <textarea
                id="topic-content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="想和对方聊什么？&#10;&#10;例如：我最近突然觉得，大学毕业以后我们可能会去完全不同的城市。想下次见面聊聊我们对未来生活的想象..."
                className="w-full p-4 rounded-2xl bg-[#FFFFFF] border border-[#DDD3C3] text-[#2E2720] placeholder-[#A69B8B] text-base leading-relaxed focus:outline-none focus:border-[#7A6A55] focus:ring-2 focus:ring-[#7A6A55]/10 resize-none transition-all shadow-2xs"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#FDF2F0] border border-[#F5C7C3] text-xs text-[#B9382E]">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#6B5F4E] hover:bg-[#EDE6D9] transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                id="btn-save-topic"
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[#383129] hover:bg-[#26201A] text-[#FAF7F2] flex items-center gap-2 shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>保存中...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>保存</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
