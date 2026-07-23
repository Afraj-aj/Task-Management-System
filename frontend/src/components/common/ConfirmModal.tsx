import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-strong rounded-2xl w-full sm:max-w-sm p-5 sm:p-6 animate-fade-in-up glow-red">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="text-danger" size={22} />
          </div>
          <h3 className="text-lg font-bold text-text">{title}</h3>
        </div>
        <p className="text-text-secondary mb-6 text-sm">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 border border-border rounded-xl text-text-secondary hover:bg-bg-secondary transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 bg-danger text-white rounded-xl font-medium hover:bg-danger-hover transition-all disabled:opacity-50 glow-red">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
