import React, { useState, useMemo } from "react";
import { Trash2, Reply } from "lucide-react";
import { getStoredUser } from "../../services/authService";

const ChatMessage = React.memo(({ message, darkMode, onDelete, onReply }) => {
  const [showActions, setShowActions] = useState(false);

  // ✅ OPTIMIZED: Only get user once with useMemo
  const currentUser = useMemo(() => getStoredUser(), []);

  // ✅ FIX: Comprehensive null checks
  const getUserId = (userId) => {
    if (!userId) return null;
    return typeof userId === "object" ? userId._id : userId;
  };

  const messageUserId = getUserId(message?.userId);
  const currentUserId = currentUser?._id;

  const isOwnMessage = !!(
    messageUserId &&
    currentUserId &&
    messageUserId === currentUserId
  );

  // Format time
  const formatTime = (date) => {
    if (!date) return "";

    try {
      const msgDate = new Date(date);
      const now = new Date();
      const diff = now - msgDate;

      // Less than 1 minute
      if (diff < 60000) return "Just now";

      // Less than 1 hour
      if (diff < 3600000) {
        const mins = Math.floor(diff / 60000);
        return `${mins}m ago`;
      }

      // Today
      if (msgDate.toDateString() === now.toDateString()) {
        return msgDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }

      // This week
      if (diff < 604800000) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return `${days[msgDate.getDay()]} ${msgDate.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        )}`;
      }

      // Older
      return msgDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  // ✅ FIX: Don't render if message data is invalid
  if (!message || !message.message) {
    console.warn("Invalid message data:", message);
    return null;
  }

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div
        className={`max-w-[70%] ${
          isOwnMessage ? "items-end" : "items-start"
        } flex flex-col`}
      >
        {/* Username (only for others' messages) */}
        {!isOwnMessage && message.userName && (
          <span
            className={`text-xs font-semibold mb-1 px-2 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            {message.userName}
          </span>
        )}

        {/* Reply indicator */}
        {message.replyTo && (
          <div
            className={`text-xs px-3 py-1 rounded-t-lg mb-1 border-l-2 ${
              darkMode
                ? "bg-gray-700 border-blue-500 text-gray-400"
                : "bg-gray-100 border-blue-500 text-gray-600"
            }`}
          >
            <span className="font-semibold">
              Replying to: {message.replyTo.userName || "Unknown"}
            </span>
            <p className="truncate">{message.replyTo.message || ""}</p>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative group">
          <div
            className={`px-4 py-2 rounded-2xl ${
              message.isDeleted
                ? darkMode
                  ? "bg-gray-700/50 text-gray-500 italic"
                  : "bg-gray-200/50 text-gray-400 italic"
                : isOwnMessage
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-100"
                : "bg-gray-200 text-gray-900"
            } ${message.replyTo ? "rounded-tl-sm" : ""}`}
          >
            <p className="text-sm break-words whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          {/* Action buttons - ✅ FIX: Only show if user is logged in and verified */}
          {showActions &&
            !message.isDeleted &&
            currentUser &&
            currentUser.isVerified && (
              <div
                className={`absolute ${
                  isOwnMessage
                    ? "left-0 -translate-x-full"
                    : "right-0 translate-x-full"
                } top-0 flex space-x-1 px-2`}
              >
                <button
                  onClick={() => onReply && onReply(message)}
                  className={`p-1.5 rounded-lg transition-all ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-blue-400"
                      : "hover:bg-gray-200 text-gray-500 hover:text-blue-600"
                  }`}
                  title="Reply"
                >
                  <Reply className="w-4 h-4" />
                </button>
                {isOwnMessage && (
                  <button
                    onClick={() => onDelete && onDelete(message._id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                        : "hover:bg-gray-200 text-gray-500 hover:text-red-600"
                    }`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Timestamp */}
        {message.createdAt && (
          <span
            className={`text-xs mt-1 px-2 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
});
export default ChatMessage;
