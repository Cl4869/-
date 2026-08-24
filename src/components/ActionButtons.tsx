import React from 'react';
import { Plus, Dices } from 'lucide-react';

interface ActionButtonsProps {
  onOpenAddModal: () => void;
  onOpenRandomModal: () => void;
  pendingCount: number;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpenAddModal,
  onOpenRandomModal,
  pendingCount,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* + 添加一个话题 */}
        <button
          id="btn-add-topic"
          type="button"
          onClick={onOpenAddModal}
          className="w-full h-14 bg-[#383129] hover:bg-[#2A241E] active:scale-[0.98] text-[#FAF7F2] font-medium rounded-2xl flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer text-base"
        >
          <div className="w-6 h-6 rounded-full bg-[#52493E] flex items-center justify-center">
            <Plus className="w-4 h-4 text-[#F3EFE9]" />
          </div>
          <span>添加一个话题</span>
        </button>

        {/* 🎲 随机抽一个 */}
        <button
          id="btn-random-topic"
          type="button"
          onClick={onOpenRandomModal}
          disabled={pendingCount === 0}
          className={`w-full h-14 font-medium rounded-2xl flex items-center justify-center gap-2.5 transition-all text-base border cursor-pointer ${
            pendingCount > 0
              ? 'bg-[#F2ECE0] hover:bg-[#EAE2D3] active:scale-[0.98] text-[#3D352B] border-[#DED4C3] shadow-xs'
              : 'bg-[#EDE7DC]/60 text-[#A89E90] border-[#E2DAD0] cursor-not-allowed'
          }`}
          title={pendingCount === 0 ? '暂无未聊话题，先添加一条吧' : '从所有未聊话题中随机抽取'}
        >
          <div className="w-6 h-6 rounded-full bg-[#E5DC CD] flex items-center justify-center">
            <Dices className="w-4 h-4 text-[#695D4D]" />
          </div>
          <span>随机抽一个</span>
        </button>
      </div>
    </div>
  );
};
