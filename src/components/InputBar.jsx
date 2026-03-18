import { useState } from 'react';
import { motion } from 'framer-motion';

export default function InputBar({ onSend, loading, darkMode }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText('');
  };

  return (
    <div className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all
      ${darkMode
        ? 'bg-[#1a2235] border-white/10'
        : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <input
        className={`flex-1 bg-transparent text-sm outline-none
          placeholder:text-gray-400
          ${darkMode ? 'text-white' : 'text-gray-800'}`}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="Message Querybot..."
      />
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleSend}
        disabled={loading || !text.trim()}
        className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-all
          ${text.trim() && !loading
            ? 'bg-gradient-to-br from-green-400 to-teal-500 shadow-md cursor-pointer'
            : 'bg-gray-300 cursor-not-allowed opacity-50'
          }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </motion.button>
    </div>
  );
}