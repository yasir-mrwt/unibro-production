import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  X,
  Loader,
  Users as UsersIcon,
  Mail,
  ShieldAlert,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import socketService from "../../services/socketService";
import { getRoomMessages, markAsRead } from "../../services/chatService";
import { getStoredUser } from "../../services/authService";

const ChatPanel = ({ darkMode, department, semester }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [typingUser, setTypingUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const user = getStoredUser();
  const isVerified = user?.isVerified || false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (department && semester && user) {
      const deptName = department.name || department;

      socketService.removeAllListeners();

      socketService.connect(user._id, user.fullName);

      socketService.joinRoom(deptName, semester, user._id, user.fullName);

      loadMessages(deptName);

      setupSocketListeners();

      return () => {
        socketService.leaveRoom(deptName, semester, user._id, user.fullName);
        socketService.removeAllListeners();
      };
    }
  }, [department, semester, user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (deptName) => {
    try {
      setLoading(true);
      const response = await getRoomMessages(deptName, semester, 50);
      if (response.success) {
        setMessages(response.messages);
        await markAsRead(deptName, semester);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onReceiveMessage((newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socketService.onUserJoined((data) => setActiveUsers(data.activeCount));
    socketService.onUserLeft((data) => setActiveUsers(data.activeCount));
    socketService.onActiveUsers((data) => setActiveUsers(data.count));

    socketService.onUserTyping((data) => {
      setTypingUser(data.userName);
      setTimeout(() => setTypingUser(null), 3000);
    });

    socketService.onUserStopTyping(() => setTypingUser(null));

    socketService.onMessageDeleted((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? data.deletedMessage : msg
        )
      );
    });
  };

  const handleSend = () => {
    if (!message.trim() || !user || !isVerified) {
      if (!isVerified) {
        setShowVerificationOverlay(true);
      }
      return;
    }

    const deptName = department?.name || department;
    setSending(true);

    socketService.sendMessage(
      deptName,
      semester,
      message.trim(),
      user._id,
      user.fullName,
      user.email,
      replyingTo?._id
    );

    setMessage("");
    setReplyingTo(null);
    setSending(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    if (isVerified) {
      const roomId = `${department?.name || department}_${semester}`;
      socketService.startTyping(roomId, user.fullName);

      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(roomId);
      }, 2000);
    }
  };

  const handleInputClick = () => {
    if (!isVerified) {
      setShowVerificationOverlay(true);
    }
  };

  const handleDelete = (messageId) => {
    const roomId = `${department?.name || department}_${semester}`;
    socketService.deleteMessage(messageId, roomId);
  };

  const handleReply = (msg) => {
    if (!isVerified) {
      setShowVerificationOverlay(true);
      return;
    }
    setReplyingTo(msg);
  };

  const cancelReply = () => setReplyingTo(null);

  return (
    <div className="relative">
      <div
        className={`h-[600px] rounded-2xl flex flex-col shadow-lg ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-3.5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle
                  className={`w-5 h-5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {activeUsers > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></span>
                )}
              </div>
              <div>
                <h3
                  className={`text-base font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Group Chat
                </h3>
                <p
                  className={`text-xs flex items-center gap-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <UsersIcon className="w-3 h-3" />
                  <span>{activeUsers} online</span>
                </p>
              </div>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                darkMode
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              {department?.name || department} • Sem {semester}
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-2 relative ${
            !isVerified ? "blur-sm pointer-events-none" : ""
          }`}
        >
          {!isVerified && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
              <div className="text-center max-w-sm">
                <ShieldAlert
                  className={`w-12 h-12 mx-auto mb-3 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-base font-semibold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Verify Your Email
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Please verify your email to access chat
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader
                className={`w-8 h-8 animate-spin ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
          ) : messages.length > 0 ? (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg._id}
                  message={msg}
                  darkMode={darkMode}
                  onDelete={handleDelete}
                  onReply={handleReply}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <MessageCircle
                className={`w-12 h-12 mb-3 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`text-center text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {typingUser && (
            <div
              className={`text-xs italic px-3 ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {typingUser} is typing...
            </div>
          )}
        </div>

        {/* ✅ FIXED: WhatsApp-style Reply Bar with proper truncation */}
        {replyingTo && (
          <div
            className={`px-4 py-2 border-t ${
              darkMode
                ? "bg-gray-750 border-gray-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start gap-2">
              {/* Vertical accent line - WhatsApp style */}
              <div className="w-1 h-9 bg-blue-500 rounded-full flex-shrink-0"></div>

              {/* Reply content */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <p
                  className={`text-xs font-medium mb-0.5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {replyingTo.userName}
                </p>
                <p
                  className={`text-xs line-clamp-1 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {replyingTo.message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={cancelReply}
                className={`p-1.5 rounded-full flex-shrink-0 ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className={`p-4 border-t ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onClick={handleInputClick}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder={
                isVerified ? "Type a message..." : "Verify email to chat"
              }
              disabled={sending}
              className={`flex-1 px-4 py-2.5 rounded-full outline-none transition-all text-sm ${
                darkMode
                  ? "bg-gray-750 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50"
                  : "bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50"
              } disabled:opacity-50 ${
                !isVerified ? "cursor-pointer border border-yellow-500/50" : ""
              }`}
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending || !isVerified}
              className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
                message.trim() && isVerified
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } disabled:opacity-50`}
            >
              {sending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationOverlay && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className={`max-w-sm w-full rounded-2xl p-6 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? "bg-yellow-500/10" : "bg-yellow-50"
              }`}
            >
              <ShieldAlert
                className={`w-8 h-8 ${
                  darkMode ? "text-yellow-500" : "text-yellow-600"
                }`}
              />
            </div>

            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Verify Your Email
            </h3>

            <p
              className={`text-sm mb-4 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Check your inbox for a verification link
            </p>

            <div
              className={`p-3 rounded-xl mb-4 text-left ${
                darkMode
                  ? "bg-blue-900/20 border border-blue-800/30"
                  : "bg-blue-50 border border-blue-100"
              }`}
            >
              <div className="flex items-start gap-2">
                <Mail
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium mb-0.5 ${
                      darkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    Sent to
                  </p>
                  <p
                    className={`text-xs truncate ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowVerificationOverlay(false)}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
