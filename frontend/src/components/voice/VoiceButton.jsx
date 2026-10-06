import React from 'react';

const VoiceButton = ({ isListening, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
      className={`relative p-4 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
        isListening
          ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse'
          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
};

export default VoiceButton;