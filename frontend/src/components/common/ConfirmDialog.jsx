import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you wish to proceed with this operation?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl shrink-0 ${
              isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-forest-700/50">
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={isDanger ? 'btn-danger' : 'btn-primary'}
            disabled={loading}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
