import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dices, CheckCheck, User, Calendar, Quote, Sparkles } from 'lucide-react';
import { Topic } from '../types';

interface RandomDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingTopics: Topic[];
  onMarkAsDiscussed: (id: string) => Promise<void>;
}

export const RandomDrawModal: React.FC<RandomDrawModalProps> = ({
  isOpen,
  onClose,
  pendingTopics,
  onMarkAsDiscussed,
}) => {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [justMarked, setJustMarked] = useState(false);

  const drawRandom = () => {
    setJustMarked(false);
    if (!pendingTopics || pendingTopics.length === 0) {
      setCurrentTopic(null);
      return;
    }
    // If only 1 item, pick it
    if (pendingTopics.length === 1) {
      setCurrentTopic(pendingTopics[0]);
      return;
    }
    // Otherwise pick a different one if possible
    let next: Topic;
    do {
      const idx = Math.floor(Math.random() * pendingTopics.length);
      next = pendingTopics[idx];
    } while (currentTopic && next.id === currentTopic.id && pendingTopics.length > 1);

    setCurrentTopic(next);
  };

  useEffect(() => {
    if (isOpen) {
      drawRandom();
    } else {
      setCurrentTopic(null);
      setJustMarked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkDiscussed = async () => {
    if (!currentTopic) return;
    try {
      setIsMarking(true);
      await onMarkAsDiscussed(currentTopic.id);
      setJustMarked(true);
    } catch (err) {
      console.error('Failed to mark topic as discussed:', err);
    } finally {
      setIsMarking(false);
    }
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1F1B18]/50 backdrop-blur-xs"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E3D9CB] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE5D8] text-[#695C4A] text-xs font-medium border border-[#DDD3C2]">
              <Sparkles className="w-3.5 h-3.5 text-[#8A7964]" />
              <span>灵感抽取</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#8A8174] hover:text-[#2E2720] p-1.5 rounded-full hover:bg-[#EFE8DC] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {currentTopic ? (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#2E2720] mb-4">
                今天聊这个
              </h3>

              {/* Topic Card Display */}
              <div className="w-full relative my-3 p-6 sm:p-8 rounded-2xl bg-linear-to-b from-[#FFFFFF] to-[#F7F3EC] border border-[#E0D6C6] shadow-xs text-left">
                <Quote className="w-8 h-8 text-[#DDD1BE] mb-2 -ml-1 opacity-80" />
                <p className="text-base sm:text-lg text-[#2B241E] leading-relaxed font-serif whitespace-pre-wrap">
                  {currentTopic.content}
                </p>

                <div className="mt-6 pt-4 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#8A7D6C]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#52483C]">
                    <User className="w-3.5 h-3.5 text-[#8C7A65]" />
                    {currentTopic.creator}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(currentTopic.created_at)}
                  </span>
                </div>
              </div>

              {justMarked ? (
                <div className="w-full mt-4 p-4 rounded-xl bg-[#EDF7EE] border border-[#C6E6C9] text-emerald-800 text-sm flex items-center justify-center gap-2">
                  <CheckCheck className="w-4 h-4" />
                  <span>已成功标记为「已聊」！</span>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <button
                  id="btn-mark-discussed-random"
                  type="button"
                  onClick={handleMarkDiscussed}
                  disabled={isMarking || justMarked}
                  className="h-12 bg-[#383129] hover:bg-[#26201A] active:scale-[0.98] text-[#FAF7F2] font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>{justMarked ? '已记录' : '标记为已聊'}</span>
                </button>

                <button
                  id="btn-draw-again"
                  type="button"
                  onClick={drawRandom}
                  disabled={isMarking || pendingTopics.length <= 1}
                  className="h-12 bg-[#EDE5D8] hover:bg-[#E3D9C9] active:scale-[0.98] text-[#42382C] font-medium rounded-xl flex items-center justify-center gap-2 border border-[#D9CEBD] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Dices className="w-4 h-4 text-[#7A6A56]" />
                  <span>再抽一个</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#7A7061] mb-4">
                当前没有未聊的话题了，去添加一个新话题吧！
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#383129] text-[#FAF7F2] rounded-xl text-sm font-medium cursor-pointer"
              >
                好的
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
