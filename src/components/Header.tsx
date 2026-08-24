import React, { useState } from 'react';
import { Sparkles, User, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  currentIdentity: string;
  onOpenIdentityModal: () => void;
  syncStatus: 'connected' | 'reconnecting' | 'disconnected';
}

export const Header: React.FC<HeaderProps> = ({
  currentIdentity,
  onOpenIdentityModal,
  syncStatus,
}) => {
  return (
    <header className="w-full max-w-xl mx-auto pt-6 pb-4 px-4 flex items-center justify-between">
      {/* Brand & Space Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#EFE9DF] text-[#635948] flex items-center justify-center shadow-xs border border-[#E2DAD0]">
          <Sparkles className="w-4 h-4 text-[#8C7A65]" />
        </div>
        <div>
          <h1 className="text-xl font-medium tracking-tight text-[#2B2723] font-serif">
            下次见面聊
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                syncStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs text-[#8A8175]">
              {syncStatus === 'connected' ? '两人空间 · 实时同步' : '正在重新连接...'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Identity Switcher */}
      <button
        id="btn-identity-toggle"
        onClick={onOpenIdentityModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A4237] bg-[#F3EDE3] hover:bg-[#EAE2D5] active:scale-95 transition-all rounded-full border border-[#E0D7C9] cursor-pointer"
        title="点击切换身份"
      >
        <User className="w-3.5 h-3.5 text-[#7C6F5E]" />
        <span>我是：<strong className="font-semibold text-[#2D2721]">{currentIdentity}</strong></span>
      </button>
    </header>
  );
};
