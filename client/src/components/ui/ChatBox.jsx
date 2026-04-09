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
  // Uses relative path - will be proxied to backend by Vite dev server
  // ─────────────────────────────────────────────────────────────────────────
  const { data: polledMessages, loading: isPolling, error: pollError } = usePolling(
    '/api/chat/get-messages',
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
    <div className="fixed bottom-0 right-4 w-80 h-96 bg-slate-900 border border-white/10 rounded-t-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-cyan-600 to-teal-600">
        <h3 className="text-sm font-semibold text-white">💬 Live Chat</h3>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white transition-colors text-lg leading-none"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-950/50">
        {localMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-xs text-center">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          localMessages.map((msg) => {
            const isCurrentUser = user?.id === msg.user_id;
            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2 animate-in fade-in-50 duration-300',
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                    isCurrentUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  )}
                >
                  {msg.user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Message Bubble */}
                <div className="flex-1 max-w-xs">
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 text-xs',
                      isCurrentUser
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-700 text-slate-100 rounded-bl-none'
                    )}
                  >
                    <p className="font-semibold text-xxs mb-1 opacity-85">
                      {msg.user?.name || 'Anonymous'}
                      {msg.user?.role && (
                        <span className="ml-1 text-xs opacity-60">
                          ({msg.user.role})
                        </span>
                      )}
                    </p>
                    <p className="break-words">{msg.message}</p>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-slate-500 mt-1 text-center">
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
          <div className="text-center text-xs text-slate-500">
            Polling for messages...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-red-900/30 border-t border-red-500/30 text-red-300 text-xs">
          {error}
        </div>
      )}

      {pollError && localMessages.length === 0 && (
        <div className="px-4 py-2 bg-yellow-900/30 border-t border-yellow-500/30 text-yellow-300 text-xs">
          {pollError}
        </div>
      )}

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-white/10 bg-slate-900 px-4 py-3 flex gap-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          disabled={isSending}
          className="flex-1 bg-slate-800 text-white text-xs rounded px-3 py-2 border border-white/10 focus:border-cyan-500 focus:outline-none transition-colors placeholder-slate-500 disabled:opacity-50"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={isSending || !messageInput.trim()}
          className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white text-xs font-medium rounded transition-colors"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
