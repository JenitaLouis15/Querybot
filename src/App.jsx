import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, MessageSquare, ArrowRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../api/chat';

export default function App() {
  const [page, setPage] = useState('home');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Querybot, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Strip markdown symbols ──────────────────────────────────────
  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/^\s*[-*+]\s/gm, '• ');
  };

  // ── Copy message ────────────────────────────────────────────────
  const copyMessage = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const [reply] = await Promise.all([
        sendMessage(updatedMessages.map(m => ({ role: m.role, content: m.content }))),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply.content,
        timestamp: new Date(),
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Querybot, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    }]);
  };

  const Background = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, left: '25%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.3)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, right: '25%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,0.25)', filter: 'blur(80px)' }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
        style={{ position: 'absolute', bottom: 0, left: '33%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(236,72,153,0.2)', filter: 'blur(80px)' }}
      />
    </div>
  );

  // ── HOME PAGE ──────────────────────────────────────────────────
  if (page === 'home') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100vh', width: '100vw', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #2e1065 70%, #1e1b4b 100%)',
        fontFamily: 'Inter, system-ui, sans-serif', position: 'relative',
      }}>
        <Background />

        {/* Navbar */}
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative', zIndex: 10, flexShrink: 0,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #60a5fa, #9333ea)', borderRadius: 14, filter: 'blur(8px)', opacity: 0.8 }} />
                <div style={{ position: 'relative', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', padding: 10, borderRadius: 14 }}>
                  <Bot size={22} color="white" />
                </div>
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, #bfdbfe, #e9d5ff, #fbcfe8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Querybot
                </h1>
                <p style={{ fontSize: 12, color: 'rgba(216,180,254,0.8)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={10} /> Powered by Groq AI
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage('chat')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', fontSize: 13,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 10, color: 'white', cursor: 'pointer',
              }}
            >
              <span>Launch Chat</span>
              <ArrowRight size={14} />
            </motion.button>
          </div>
        </motion.header>

        {/* Hero */}
        <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', gap: 28, overflowY: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'absolute', inset: -8, background: 'linear-gradient(135deg, #60a5fa, #9333ea)', borderRadius: 28, filter: 'blur(16px)', opacity: 0.6 }} />
              <div style={{ position: 'relative', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', padding: 20, borderRadius: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <Bot size={44} color="white" />
              </div>
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 'clamp(26px, 5vw, 52px)', fontWeight: 800, margin: '0 0 12px', background: 'linear-gradient(90deg, #bfdbfe, #e9d5ff, #fbcfe8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Meet Querybot
              </h1>
              <p style={{ fontSize: 'clamp(13px, 2vw, 17px)', color: 'rgba(216,180,254,0.8)', margin: 0, maxWidth: 440, lineHeight: 1.6 }}>
                Your intelligent AI assistant powered by Groq. Ask anything, get instant answers.
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('chat')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 32px', fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
              border: 'none', borderRadius: 16, color: 'white',
              cursor: 'pointer', boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
            }}
          >
            <span>Start Chatting</span>
            <ArrowRight size={18} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 680, width: '100%' }}
          >
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Powered by Groq LPU' },
              { icon: '🧠', title: 'Smart Answers', desc: 'Advanced AI reasoning' },
              { icon: '💬', title: 'Natural Chat', desc: 'Human-like conversation' },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.04 }}
                style={{
                  padding: '14px 18px', borderRadius: 16,
                  flex: '1 1 140px', maxWidth: 200,
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(216,180,254,0.7)' }}>{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style>{`* { box-sizing: border-box; }`}</style>
      </div>
    );
  }

  // ── CHAT PAGE ──────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', width: '100vw', overflow: 'hidden',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #2e1065 70%, #1e1b4b 100%)',
      fontFamily: 'Inter, system-ui, sans-serif', position: 'relative',
    }}>
      <Background />

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'relative', zIndex: 10, flexShrink: 0,
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setPage('home')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(216,180,254,0.8)', fontSize: 13, padding: '4px 8px', borderRadius: 8 }}
            >
              ← Home
            </motion.button>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #60a5fa, #9333ea)', borderRadius: 14, filter: 'blur(8px)', opacity: 0.8 }} />
              <div style={{ position: 'relative', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', padding: 9, borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                <Bot size={20} color="white" />
              </div>
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, #bfdbfe, #e9d5ff, #fbcfe8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Querybot
              </h1>
              <p style={{ fontSize: 11, color: 'rgba(216,180,254,0.8)', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Sparkles size={9} /> Powered by Groq AI
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={clearChat}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', fontSize: 12, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, color: 'white', cursor: 'pointer' }}
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </motion.button>
        </div>
      </motion.header>

      {/* Messages */}
      <main style={{ position: 'relative', zIndex: 10, flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: 10, flexDirection: message.role === 'user' ? 'row-reverse' : 'row' }}
              >
                {/* Avatar */}
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    {message.role === 'assistant' && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #60a5fa, #9333ea)', borderRadius: 12, filter: 'blur(6px)', opacity: 0.7 }} />
                    )}
                    <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: message.role === 'user' ? 'linear-gradient(135deg, #34d399, #14b8a6, #06b6d4)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      {message.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                    </div>
                  </div>
                </motion.div>

                {/* Bubble */}
                <div style={{ maxWidth: 'min(72%, 520px)', display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div
                    style={{ position: 'relative', padding: '10px 14px', borderRadius: 14, backdropFilter: 'blur(20px)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', background: message.role === 'user' ? 'linear-gradient(135deg, #059669, #0d9488, #0891b2)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    {message.role === 'assistant' && (
                      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }} />
                    )}
                    <p style={{ position: 'relative', fontSize: 14, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {formatText(message.content)}
                    </p>

                    {/* Copy button — only for assistant */}
                    {message.role === 'assistant' && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyMessage(message.id, message.content)}
                        style={{ position: 'relative', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(216,180,254,0.6)', fontSize: 11, padding: 0 }}
                      >
                        {copiedId === message.id ? <Check size={12} /> : <Copy size={12} />}
                        {copiedId === message.id ? 'Copied!' : 'Copy'}
                      </motion.button>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(216,180,254,0.4)', marginTop: 3, paddingLeft: 2 }}>
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', gap: 10 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #60a5fa, #9333ea)', borderRadius: 12, filter: 'blur(6px)', opacity: 0.7 }} />
                    <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      <Bot size={16} color="white" />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: 13 }}>Querybot is thinking</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div key={i} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay }} style={{ width: 6, height: 6, borderRadius: '50%', background: ['#c084fc', '#60a5fa', '#f472b6'][i] }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        style={{ position: 'relative', zIndex: 10, flexShrink: 0, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.12)', padding: '10px 12px' }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
              style={{ width: '100%', padding: '12px 40px 12px 16px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
            <MessageSquare size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(216,180,254,0.5)', pointerEvents: 'none' }} />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{ padding: '12px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', color: 'white', fontSize: 14, fontWeight: 600, cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed', opacity: inputValue.trim() && !isLoading ? 1 : 0.5, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
          >
            {isLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
            <span>Send</span>
          </motion.button>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 999px; }
        input::placeholder { color: rgba(216,180,254,0.5); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}