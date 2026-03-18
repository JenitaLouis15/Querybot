import { motion } from 'framer-motion';

export default function MessageBubble({ message, darkMode }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md">
          Q
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed
        ${isUser
          ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white rounded-2xl rounded-tr-sm shadow-md'
          : darkMode
            ? 'bg-[#1a2235] text-gray-100 rounded-2xl rounded-tl-sm border border-white/10 shadow-md'
            : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-200 shadow-sm'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1 shadow-md">
          U
        </div>
      )}
    </motion.div>
  );
}