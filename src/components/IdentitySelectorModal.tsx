import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, UserCheck } from 'lucide-react';

interface IdentitySelectorModalProps {
  isOpen: boolean;
  currentIdentity: string;
  onSelectIdentity: (name: string) => void;
  onClose: () => void;
}

const PRESET_NAMES = ['乐乐', '朋友'];

export const IdentitySelectorModal: React.FC<IdentitySelectorModalProps> = ({
  isOpen,
  currentIdentity,
  onSelectIdentity,
  onClose,
}) => {
  const [customName, setCustomName] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onSelectIdentity(customName.trim());
      onClose();
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
          className="fixed inset-0 bg-[#1F1B18]/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-[#FAF7F2] rounded-2xl p-6 shadow-xl border border-[#E8E1D5] z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#2D2721] flex items-center gap-2 font-serif">
              <UserCheck className="w-4 h-4 text-[#8C7A65]" />
              选择你的身份
            </h3>
            <button
              onClick={onClose}
              className="text-[#8A8175] hover:text-[#2D2721] p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#7A7163] mb-5 leading-relaxed">
            在这个小空间里，你写下的话题会自动署上你的名字。
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {PRESET_NAMES.map((name) => {
              const isSelected = currentIdentity === name && !isCustom;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    onSelectIdentity(name);
                    onClose();
                  }}
                  className={`h-12 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#3A332C] text-[#FAF7F2] border-[#3A332C] shadow-xs'
                      : 'bg-[#F2ECE2] text-[#4A4237] border-[#DFD6C7] hover:bg-[#E8E1D4]'
                  }`}
                >
                  <span>{name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#E2D5C3]" />}
                </button>
              );
            })}
          </div>

          {/* Custom Nickname Input */}
          {!isCustom ? (
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className="w-full text-center text-xs text-[#8A7E6E] hover:text-[#4A4237] py-2 transition-colors cursor-pointer"
            >
              想要使用其他称呼？
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="mt-3 pt-3 border-t border-[#E8E1D5]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="输入自定义称呼..."
                  maxLength={12}
                  className="flex-1 px-3 py-2 text-sm bg-[#FFFFFF] border border-[#D9D0C1] rounded-xl text-[#2D2721] focus:outline-none focus:border-[#7A6A55]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!customName.trim()}
                  className="px-4 py-2 text-sm bg-[#3A332C] text-[#FAF7F2] rounded-xl font-medium disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  确定
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
