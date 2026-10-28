import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Play, 
  Square, 
  Check, 
  X, 
  Volume2, 
  RotateCcw, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { RINGTONE_OPTIONS, RingtoneItem, soundStudio } from '../services/soundStudio';
import { useBackHandler } from '../services/backNavigation';

interface RingtonePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCategoryTitle: string;
  selectedRingtoneId: string;
  onSelectRingtone: (ringtoneId: string) => void;
  masterVolume?: number;
}

export const RingtonePickerModal: React.FC<RingtonePickerModalProps> = ({
  isOpen,
  onClose,
  targetCategoryTitle,
  selectedRingtoneId,
  onSelectRingtone,
  masterVolume = 85
}) => {
  const [tempSelected, setTempSelected] = useState<string>(selectedRingtoneId);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Android back button handling
  useBackHandler(
    'ringtone_picker_modal',
    90,
    () => {
      if (isOpen) {
        soundStudio.stopPreview();
        onClose();
        return true;
      }
      return false;
    },
    isOpen
  );

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedRingtoneId);
    } else {
      soundStudio.stopPreview();
    }
  }, [isOpen, selectedRingtoneId]);

  useEffect(() => {
    const unsubscribe = soundStudio.subscribePlaying((id) => {
      setPlayingId(id);
    });
    return () => {
      unsubscribe();
      soundStudio.stopPreview();
    };
  }, []);

  if (!isOpen) return null;

  function handlePlayToggle(item: RingtoneItem, e: React.MouseEvent) {
    e.stopPropagation();
    if (playingId === item.id) {
      soundStudio.stopPreview();
    } else {
      soundStudio.playPreview(item.id, masterVolume, true);
    }
  }

  function handleSave() {
    soundStudio.stopPreview();
    onSelectRingtone(tempSelected);
    onClose();
  }

  function handleResetDefault() {
    soundStudio.stopPreview();
    setTempSelected('default');
    soundStudio.playPreview('default', masterVolume, true);
  }

  function handleCancel() {
    soundStudio.stopPreview();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-warm-border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warm-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-warm-textDark font-serif">Select Ringtone Sound</h3>
              <p className="text-xs text-warm-textMuted">For {targetCategoryTitle}</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-xl text-warm-textMuted hover:text-warm-textDark hover:bg-warm-cardMuted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ringtone List */}
        <div className="py-3 space-y-2 overflow-y-auto flex-1 my-1 pr-1">
          {RINGTONE_OPTIONS.map((item) => {
            const isSelected = tempSelected === item.id;
            const isPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setTempSelected(item.id);
                  soundStudio.playPreview(item.id, masterVolume, true);
                }}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-200'
                    : 'bg-white border-warm-border hover:bg-warm-cardMuted/50 hover:border-warm-border'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <button
                    type="button"
                    onClick={(e) => handlePlayToggle(item, e)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition shrink-0 ${
                      isPlaying
                        ? 'bg-rose-600 text-white shadow-md animate-pulse'
                        : 'bg-warm-cardMuted text-warm-textDark hover:bg-rose-100 hover:text-rose-600'
                    }`}
                    title={isPlaying ? 'Stop preview' : 'Play preview'}
                  >
                    {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-warm-textDark truncate">{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-warm-cardMuted text-warm-textMuted font-medium border border-warm-border/60">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-warm-textMuted truncate">{item.description}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-warm-border bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Settings Footnote */}
        <div className="px-3 py-2 bg-amber-50/80 rounded-xl border border-amber-200/70 text-[11px] text-amber-900 flex items-start gap-2 shrink-0">
          <Smartphone className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong>Android System Tip:</strong> On Android 13+, ringtone volume and Do Not Disturb are also controlled by your device system settings.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-warm-border flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefault}
            className="w-full sm:w-auto text-xs font-semibold text-warm-textMuted hover:text-warm-textDark py-2 px-3 rounded-xl hover:bg-warm-cardMuted transition flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 sm:flex-none text-xs font-bold text-warm-textDark py-2.5 px-4 rounded-xl border border-warm-border hover:bg-warm-cardMuted transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 py-2.5 px-5 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
