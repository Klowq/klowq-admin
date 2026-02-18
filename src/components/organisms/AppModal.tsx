import React from 'react';

interface AppModalProps {
  children: React.ReactNode;
  mode?: boolean;
}

export default function AppModal({ children, mode = false }: AppModalProps) {
  return mode ? (
    <div className="bg-gray-400/20 flex items-center backdrop-blur-xl z-50 h-screen w-screen fixed top-0 right-0">
      <div className="w-screen p-3">
        <div className="relative">{children}</div>
      </div>
    </div>
  ) : null;
}
