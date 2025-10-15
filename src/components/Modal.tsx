// src/components/Modal.tsx

import type { } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-default">
          <style>{`
            .scrollbar-default::-webkit-scrollbar {
              width: 16px;
            }
            .scrollbar-default::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-default::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border: 4px solid white;
              border-radius: 8px;
            }
            .scrollbar-default::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;