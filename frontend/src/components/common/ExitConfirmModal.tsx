import React from 'react';
import { LogOut, Heart, X } from 'lucide-react';
import { LotusBloomIcon } from './LotusBloomIcon';

interface ExitConfirmModalProps {
  isOpen: boolean;
  onStay: () => void;
  onExit: () => void;
}

export const ExitConfirmModal: React.FC<ExitConfirmModalProps> = ({
  isOpen,
  onStay,
  onExit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-warm-border transform transition-all animate-scale-up text-center relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
      >
        {/* Soft background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-brand-100/60 blur-2xl pointer-events-none" />

        {/* Brand Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-brand-500 to-amber-400 p-0.5 shadow-lg mx-auto mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
            <LotusBloomIcon className="w-8 h-8 text-rose-500" />
          </div>
        </div>

        {/* Title */}
        <h3 id="exit-modal-title" className="font-serif font-black text-xl text-warm-textDark tracking-tight mb-2">
          Exit HER LIFE?
        </h3>

        {/* Message */}
        <p className="text-sm text-warm-textMuted leading-relaxed mb-6 font-medium">
          Are you sure you want to exit the app? Your daily health records and cycle data are safely preserved.
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onStay}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-warm-cardMuted hover:bg-warm-border text-warm-textDark transition active:scale-95"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onExit}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-brand-600 hover:from-rose-600 hover:to-brand-700 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
