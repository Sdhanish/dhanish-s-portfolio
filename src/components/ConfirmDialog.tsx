import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Listen for Escape key to close dialog
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isLoading, onCancel]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Semi-transparent backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isLoading && onCancel()}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-portfolio-surface dark:bg-[#1A1A1A] border border-portfolio-border rounded-2xl shadow-2xl p-6 text-portfolio-text-primary overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            {/* Close X Button */}
            <button
              type="button"
              onClick={() => !isLoading && onCancel()}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 rounded-xl text-portfolio-text-muted hover:text-portfolio-text-primary hover:bg-portfolio-surface-hover transition-colors disabled:opacity-50"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4">
              {/* Icon Badge */}
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  variant === 'danger'
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : variant === 'warning'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-[#6C8E12]/10 text-[#6C8E12] border border-[#6C8E12]/20'
                }`}
              >
                {variant === 'danger' ? (
                  <Trash2 className="w-6 h-6" />
                ) : variant === 'warning' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              {/* Title and Message */}
              <div className="flex-1 min-w-0 pr-6">
                <h3
                  id="confirm-dialog-title"
                  className="text-lg font-bold text-portfolio-text-primary leading-snug"
                >
                  {title}
                </h3>
                <p
                  id="confirm-dialog-description"
                  className="mt-2 text-sm text-portfolio-text-secondary leading-relaxed"
                >
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-portfolio-text-secondary hover:text-portfolio-text-primary bg-portfolio-surface-hover/60 hover:bg-portfolio-surface-hover border border-portfolio-border transition-all disabled:opacity-50 cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50 ${
                  variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                    : variant === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                    : 'bg-[#6C8E12] hover:bg-[#7ba314] text-white shadow-[#6C8E12]/20'
                }`}
              >
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
