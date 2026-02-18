import React from 'react';

interface AppModalProps {
  children: React.ReactNode;
  mode?: boolean;
  onClose?: () => void;
}

export default function AppModal({ children, mode = false, onClose }: AppModalProps) {
  return mode ? (
    <div
      className="bg-black/50 flex items-center justify-center backdrop-blur-xl z-50 h-screen w-screen fixed inset-0 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-h-full overflow-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
}
