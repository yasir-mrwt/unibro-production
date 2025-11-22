import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Send,
  X,
  Loader,
  Users as UsersIcon,
  MessageCircle,
  Reply,
  Mail,
  ShieldAlert,
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import socketService from "../../services/socketService";
import { getRoomMessages, markAsRead } from "../../services/chatService";
import { getStoredUser } from "../../services/authService";

const ChatModal = ({ isOpen, onClose, department, semester, darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [typingUser, setTypingUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showVerificationOverlay, setShowVerificationOverlay] = useState(false);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const listenersSetupRef = useRef(false);

  const user = getStoredUser();
  const isVerified = user?.isVerified || false;

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Setup socket listeners ONCE when modal is first opened
  useEffect(() => {
    if (!isOpen || !user || listenersSetupRef.current) return;

    listenersSetupRef.current = true;

    if (!socketService.isConnected()) {
      socketService.connect(user._id, user.fullName);
    }

    socketService.onReceiveMessage((newMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
      setTimeout(() => scrollToBottom(), 100);
    });

    socketService.onUserJoined((data) => {
      setActiveUsers(data.activeCount);
    });

    socketService.onUserLeft((data) => {
      setActiveUsers(data.activeCount);
    });

    socketService.onActiveUsers((data) => {
      setActiveUsers(data.count);
    });

    socketService.onUserTyping((data) => {
      setTypingUser(data.userName);
      setTimeout(() => setTypingUser(null), 3000);
    });

    socketService.onUserStopTyping(() => {
      setTypingUser(null);
    });

    socketService.onMessageDeleted((data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId ? data.deletedMessage : msg
        )
      );
    });
  }, [isOpen, user]);

  // Load messages and join room when opened
  useEffect(() => {
    if (!isOpen || !user || !department || !semester) return;

    const deptName = department?.name || department;

    socketService.joinRoom(deptName, semester, user._id, user.fullName);

    loadMessages(deptName);

    markAsRead(deptName, semester);

    return () => {
      if (department && semester) {
        const deptName = department?.name || department;
        socketService.leaveRoom(deptName, semester, user._id, user.fullName);
      }
    };
  }, [isOpen, department, semester]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const loadMessages = async (deptName) => {
    try {
      setLoading(true);
      const response = await getRoomMessages(deptName, semester, 50);

      if (response.success) {
        setMessages(response.messages);
        setTimeout(() => scrollToBottom(false), 100);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
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
    setTimeout(() => scrollToBottom(true), 100);
  };

  const handleDelete = (messageId) => {
    const roomId = `${department?.name || department}_${semester}`;
    socketService.deleteMessage(messageId, roomId);
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

  const handleReply = (msg) => {
    if (!isVerified) {
      setShowVerificationOverlay(true);
      return;
    }

    setReplyingTo(msg);
    const replyText = `@${msg.userName} `;
    setMessage(replyText);

    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      input?.focus();
      input?.setSelectionRange(replyText.length, replyText.length);
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearReply = () => setReplyingTo(null);

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center">
        <p>Please log in to use chat</p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col lg:hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header - ALWAYS VISIBLE */}
      <div
        className={`flex items-center justify-between px-4 py-4 border-b ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${
            darkMode
              ? "hover:bg-gray-700 text-gray-300"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <h2
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Group Chat
          </h2>
          <p
            className={`text-xs flex items-center justify-center space-x-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <UsersIcon className="w-3 h-3" />
            <span>{activeUsers} online</span>
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Department Info - ALWAYS VISIBLE */}
      <div
        className={`px-4 py-2 text-center border-b ${
          darkMode
            ? "bg-gray-800/50 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          {department?.name || department} • Semester {semester}
        </p>
      </div>

      {/* Messages Area - BLURRED when not verified */}
      <div
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-4 scroll-smooth relative ${
          !isVerified ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {!isVerified && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
            <div className="text-center max-w-sm">
              <ShieldAlert
                className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <h3
                className={`text-lg font-bold mb-2 ${
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
                Please verify your email address to access the group chat and
                connect with your classmates.
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
              className={`w-16 h-16 mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p
              className={`text-center ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No messages yet
              <br />
              Start the conversation!
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

      {/* Reply indicator - ALWAYS VISIBLE */}
      {replyingTo && (
        <div
          className={`px-4 py-2 border-t flex items-center justify-between ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-2 flex-1">
            <Reply
              className={`w-4 h-4 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-xs font-semibold ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Replying to {replyingTo.userName}
              </p>
              <p
                className={`text-xs truncate ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {replyingTo.message}
              </p>
            </div>
          </div>
          <button
            onClick={handleClearReply}
            className={`p-1 rounded-lg ${
              darkMode
                ? "hover:bg-gray-700 text-gray-400"
                : "hover:bg-gray-200 text-gray-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Area - ALWAYS VISIBLE but shows overlay when clicked if not verified */}
      <div
        className={`p-4 border-t ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={handleTyping}
            onClick={handleInputClick}
            onKeyPress={handleKeyPress}
            placeholder={
              replyingTo
                ? `Replying to ${replyingTo.userName}...`
                : isVerified
                ? "Type a message..."
                : "Verify email to chat..."
            }
            disabled={sending}
            className={`flex-1 px-4 py-3 rounded-xl outline-none ${
              darkMode
                ? "bg-gray-750 text-white placeholder-gray-500"
                : "bg-gray-100 text-gray-900 placeholder-gray-500"
            } disabled:opacity-50 ${
              !isVerified
                ? "cursor-pointer border-2 border-dashed border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                : ""
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending || !isVerified}
            className={`p-3 rounded-xl transition-all ${
              isVerified
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            } disabled:opacity-50`}
          >
            {sending ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Verification Modal Overlay - Shows when user tries to interact */}
      {showVerificationOverlay && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/50">
          <div
            className={`max-w-md w-full rounded-2xl p-8 text-center ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>

            <h3
              className={`text-2xl font-bold mb-3 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Verify Your Email
            </h3>

            <p
              className={`mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Please verify your email address to access the group chat and
              connect with your classmates.
            </p>

            <div
              className={`p-4 rounded-xl mb-6 ${
                darkMode
                  ? "bg-blue-900/20 border border-blue-800"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <Mail
                  className={`w-5 h-5 mt-0.5 ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div className="text-left">
                  <p
                    className={`text-sm font-medium mb-1 ${
                      darkMode ? "text-blue-400" : "text-blue-700"
                    }`}
                  >
                    Check your inbox
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-blue-300" : "text-blue-600"
                    }`}
                  >
                    We sent a verification link to{" "}
                    <span className="font-semibold">{user?.email}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVerificationOverlay(false)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  darkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
