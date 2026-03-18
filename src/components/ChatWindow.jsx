import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { sendMessage } from '../../api/chat';

export default function ChatWindow({ darkMode, setDarkMode }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userText) => {
    const updated = [...messages, { role: 'user', content: userText }];
    setMessages(updated);
    setLoading(true);
    try {
      const reply = await sendMessage(updated);
      setMessages([...updated, reply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = messages.filter(m => m.role !== 'system');

  return (
    <div className={`flex flex-col w-full h-screen ${darkMode ? 'bg-[#0a0f1e]' : 'bg-[#f0faf8]'}`}>

      {/* Navbar */}
      <div className={`shrink-0 w-full px-6 py-4 flex items-center justify-between border-b
        ${darkMode ? 'bg-[#0d1424] border-white/10' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
            Q
          </div>
          <span className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Querybot
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer
            ${darkMode ? 'bg-teal-500' : 'bg-gray-300'}`}
        >
          <motion.div
            animate={{ x: darkMode ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
          />
        </motion.button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 mt-24"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-3xl shadow-xl"
              >
                🤖
              </motion.div>
              <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Hi! I'm Querybot
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Ask me anything to get started
              </p>
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence>
            {filtered.map((msg, i) => (
              <MessageBubble key={i} message={msg} darkMode={darkMode} />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  Q
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 items-center
                  ${darkMode ? 'bg-white/10' : 'bg-white border border-gray-100'}`}
                >
                  {[0, 1, 2].map(j => (
                    <motion.span
                      key={j}
                      className="w-2 h-2 bg-teal-400 rounded-full block"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay: j * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar — fixed at bottom, Claude style */}
      <div className={`shrink-0 border-t ${darkMode ? 'border-white/10 bg-[#0d1424]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4">
          <InputBar onSend={handleSend} loading={loading} darkMode={darkMode} />
        </div>
      </div>

    </div>
  );
}