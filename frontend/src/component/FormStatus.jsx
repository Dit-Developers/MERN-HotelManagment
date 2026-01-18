import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function FormStatus({ type, message, onClose }) {
  useEffect(() => {
    if (!message || !onClose) {
      return;
    }
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const isSuccess = type === 'success';

  const baseClasses = 'w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-sm border text-sm sm:text-[0.9rem] transition-all duration-300 shadow-lg bg-white flex items-start justify-between gap-3';
  const successClasses = 'bg-green-50 border-green-200 text-green-800';
  const errorClasses = 'bg-red-50 border-red-200 text-red-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      <div className={`${baseClasses} ${isSuccess ? successClasses : errorClasses} relative z-10`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {isSuccess ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationCircle className="text-red-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium tracking-wide uppercase text-[0.7rem] sm:text-xs mb-0.5">
              {isSuccess ? 'Success' : 'Error'}
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-2 text-xs sm:text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default FormStatus;
