import React from 'react';

const VoiceStatus = ({ status, transcript }) => {
  if (!status) return null;

  return (
    <div className="bg-gray-900/90 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl max-w-md mx-auto flex items-center justify-between border border-gray-800">
      <div className="flex items-center space-x-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-sm font-medium tracking-wide">{status}</span>
      </div>

      {transcript && (
        <p className="text-xs text-emerald-300 italic truncate max-w-[200px] ml-4 bg-gray-800/60 px-2.5 py-1 rounded-md">
          "{transcript}"
        </p>
      )}
    </div>
  );
};

export default VoiceStatus;