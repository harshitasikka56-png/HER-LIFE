import React, { useEffect } from 'react';
import { Bell, X, ShieldAlert, ShieldCheck, Heart } from 'lucide-react';

interface NotificationToastProps {
  show: boolean;
  title: string;
  body: string;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  show,
  title,
  body,
  onDismiss
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-soft-lg border-2 border-brand-400/50 animate-bounce-subtle transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-plum-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Bell className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-warm-textDark">{title}</span>
            <span className="text-[10px] text-warm-textMuted bg-warm-cardMuted px-1.5 py-0.5 rounded">Just Now</span>
          </div>
          <p className="text-xs text-warm-textDark/80 leading-relaxed">{body}</p>
          <div className="pt-1 flex items-center gap-1 text-[10px] text-brand-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HER LIFE Smart Pre-Alert</span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-warm-textMuted hover:text-warm-textDark p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
