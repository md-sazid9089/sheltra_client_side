import { useState, useEffect, useRef } from 'react';
import { usePolling } from '@/hooks/usePolling';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/cn';
import api from '@/lib/api';

/**
 * ChatBox Component - Polling-Based Chat UI
 * 
 * Features:
 * - Displays real-time chat messages from all users
 * - Uses polling mechanism (fetches messages every 3 seconds)
 * - Prevents message duplication using lastMessageId
 * - Auto-scrolls to latest messages
 * - Shows user name, role badge, and timestamp for each message
 * - Input field to send messages
 * - Shows loading/error states
 * 
 * Props:
 * - isOpen: Whether chat box is visible (boolean)
 * - onClose: Callback when closing chat (function)
 * 
 * @component
 * @example
 * <ChatBox isOpen={showChat} onClose={() => setShowChat(false)} />
 */
export function ChatBox({ isOpen, onClose }) {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [localMessages, setLocalMessages] = useState([]);
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // Hook: Poll for new messages every 3 seconds
  // Uses centralized api client baseURL (VITE_API_URL already includes /api)
  // ─────────────────────────────────────────────────────────────────────────
  const { data: polledMessages, loading: isPolling, error: pollError } = usePolling(
    '/chat/get-messages',
    {
      lastMessageId: lastMessageId,
      limit: 50,
    },
    3000 // Poll interval: 3 seconds
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Effect: Update local messages list when polled messages arrive
  // Prevents duplicates by tracking lastMessageId
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (polledMessages && polledMessages.length > 0) {
      // Only add new messages (not already in localMessages)
      const newMessages = polledMessages.filter(
        (msg) => !localMessages.some((local) => local.id === msg.id)
      );

      if (newMessages.length > 0) {
        setLocalMessages((prev) => [...prev, ...newMessages]);
        // Update lastMessageId to prevent duplicates in next poll
        setLastMessageId(polledMessages[polledMessages.length - 1].id);
      }
    }
  }, [polledMessages]);

  // ─────────────────────────────────────────────────────────────────────────
  // Effect: Auto-scroll to bottom when new messages arrive
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handle: Send message to server using axios API module
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate input
    if (!messageInput.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (messageInput.length > 1000) {
      setError('Message is too long (max 1000 characters)');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // POST to send-message endpoint using api module
      const result = await api.post('/chat/send-message', {
        message: messageInput,
      });

      // Clear input after successful send
      setMessageInput('');

      // Add the sent message immediately to UI (optimistic update)
      if (result.data?.data) {
        setLocalMessages((prev) => [...prev, result.data.data]);
        if (result.data.data.id) {
          setLastMessageId(result.data.data.id);
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Format: Display timestamp in readable format
  // ─────────────────────────────────────────────────────────────────────────
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Chat Box UI
  // ─────────────────────────────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-[900px] max-w-[calc(100vw-32px)] h-[800px] bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/10 bg-gradient-to-r from-cyan-600/95 via-teal-600/85 to-cyan-700/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <span className="text-5xl">💬</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Live Support Chat</h3>
            <p className="text-sm text-cyan-100/70">Response time: ~1-2 minutes</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/20 transition-all duration-200 text-white hover:scale-110"
          aria-label="Close chat"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gradient-to-b from-slate-950/80 to-slate-900/40 custom-scrollbar">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center gap-6">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/8 border border-white/15">
              <span className="text-6xl">💬</span>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-300">No messages yet</p>
              <p className="text-base text-slate-500 mt-2">Start a conversation with our support team</p>
            </div>
          </div>
        ) : (
          localMessages.map((msg) => {
            const isCurrentUser = user?.id === msg.user_id;
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3 animate-in fade-in-50 duration-300 items-end',
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0 border-2 border-white/20',
                    isCurrentUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      : 'bg-gradient-to-br from-purple-600 to-pink-600'
                  )}
                >
                  {msg.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Message Bubble */}
                <div className="flex-1 max-w-2xl">
                  <div
                    className={cn(
                      'rounded-3xl px-6 py-4 text-base leading-relaxed backdrop-blur-sm border',
                      isCurrentUser
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-br-none border-cyan-400/30 shadow-lg'
                        : 'bg-slate-800 text-slate-50 rounded-bl-none border-white/10 shadow-md'
                    )}
                  >
                    <p className="font-semibold text-sm mb-2 opacity-90">
                      {msg.user?.name || 'Anonymous'}
                      {msg.user?.role && (
                        <span className={cn('ml-3 text-sm opacity-70 px-3 py-1 rounded-full inline-block', isCurrentUser ? 'bg-white/20' : 'bg-white/10')}>
                          {msg.user.role}
                        </span>
                      )}
                    </p>
                    <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <p className={cn('text-sm mt-3 font-medium', isCurrentUser ? 'text-right text-cyan-300/70' : 'text-left text-slate-500')}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />

        {/* Loading indicator */}
        {isPolling && localMessages.length > 0 && (
          <div className="flex items-center justify-center gap-3 text-base text-cyan-300/60 py-3">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-8 py-4 bg-red-900/40 border-t border-red-500/40 text-red-200 text-base font-medium flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </div>
      )}

      {pollError && localMessages.length === 0 && (
        <div className="px-8 py-4 bg-yellow-900/40 border-t border-yellow-500/40 text-yellow-200 text-base font-medium flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
          </svg>
          {pollError}
        </div>
      )}

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-white/10 bg-gradient-to-t from-slate-950 to-slate-900 px-8 py-5 flex gap-4"
      >
        <input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-slate-800/80 text-white text-base rounded-2xl px-6 py-4 border border-white/15 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all placeholder-slate-500/60 disabled:opacity-50 backdrop-blur-sm"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={isSending || !messageInput.trim()}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 text-base shadow-lg hover:shadow-cyan-500/40 disabled:shadow-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
