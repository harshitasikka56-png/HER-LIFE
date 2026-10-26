import React, { useState } from 'react';
import { X, MessageSquareHeart, Star, Send, CheckCircle2, Bug, Lightbulb, Heart } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<'praise' | 'bug' | 'feature' | 'ai'>('praise');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 2.5s
      setTimeout(() => {
        setSubmitted(false);
        setFeedbackText('');
        onClose();
      }, 2500);
    }, 400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-rose-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 via-warm-bg to-brand-50 border-b border-warm-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-soft">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-warm-textDark">Share Feedback & Ideas</h3>
              <p className="text-xs text-warm-textMuted">Help us make HER LIFE even better for women everywhere</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-rose-100 text-warm-textMuted hover:text-warm-textDark transition border border-warm-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif font-bold text-xl text-warm-textDark">Thank You! 💖</h4>
            <p className="text-xs text-warm-textMuted max-w-xs">
              Your feedback was received and prioritized for our upcoming clinical & UI release.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Rating Stars */}
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold text-warm-textMuted uppercase tracking-wider">How is your experience with HER LIFE?</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-warm-textDark">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'praise', label: 'Love It', icon: Heart },
                  { id: 'bug', label: 'Report Bug', icon: Bug },
                  { id: 'feature', label: 'New Idea', icon: Lightbulb },
                  { id: 'ai', label: 'AI Voice/Chat', icon: MessageSquareHeart },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCategory(item.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                        category === item.id
                          ? 'bg-brand-50 border-brand-400 text-brand-800 font-bold shadow-xs'
                          : 'bg-white border-warm-border text-warm-textMuted hover:bg-warm-cardMuted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Details Text Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-warm-textDark">Tell us more</label>
              <textarea
                rows={3}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="What did you love or what can we improve? (e.g. voice assistant, notifications, cycle predictions...)"
                className="w-full p-3 rounded-2xl bg-warm-cardMuted border border-warm-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
