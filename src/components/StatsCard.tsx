import React from 'react';
import { motion } from 'motion/react';
import { MessageSquareQuote, HeartHandshake } from 'lucide-react';

interface StatsCardProps {
  pendingCount: number;
  discussedCount: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  pendingCount,
  discussedCount,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto px-4 my-2"
    >
      <div className="relative overflow-hidden bg-linear-to-b from-[#F5EFE6] to-[#ECE4D8] border border-[#E2D8CA] rounded-3xl p-6 sm:p-8 shadow-xs text-center">
        {/* Soft background decor */}
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-[#E5DC CE]/40 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-28 h-28 rounded-full bg-[#EAE1D3]/50 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5DDCF]/80 text-[#6B5F4E] text-xs font-medium mb-3.5 border border-[#DACFBF]">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#857662]" />
            <span>留到下次见面</span>
          </div>

          <h2 className="text-lg sm:text-xl font-medium text-[#423A30] mb-2 font-serif">
            我们还有
          </h2>

          <div className="flex items-baseline justify-center gap-2 my-1">
            <span className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-[#2B251F]">
              {pendingCount}
            </span>
            <span className="text-lg sm:text-xl font-medium text-[#52483C] font-serif">
              个话题没有聊
            </span>
          </div>

          {discussedCount > 0 && (
            <div className="mt-4 pt-3 border-t border-[#DECFC0]/80 flex items-center gap-2 text-xs text-[#786D5D]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#8A7964]" />
              <span>已经共同聊完了 {discussedCount} 个想法</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
