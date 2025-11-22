import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { getUnreadCount } from "../../services/chatService";

const ChatIcon = ({ onClick, department, semester, darkMode }) => {
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 100,
  });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTouch, setInitialTouch] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const iconRef = useRef(null);

  // Load unread count
  useEffect(() => {
    if (department && semester) {
      loadUnreadCount();

      // Poll every 10 seconds
      const interval = setInterval(loadUnreadCount, 10000);
      return () => clearInterval(interval);
    }
  }, [department, semester]);

  const loadUnreadCount = async () => {
    try {
      const deptName = department?.name || department;
      const response = await getUnreadCount(deptName, semester);
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  // Handle touch start (mobile)
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragging(true);
    setHasMoved(false);
    setInitialTouch({
      x: touch.clientX,
      y: touch.clientY,
    });
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  // Handle touch move (mobile)
  const handleTouchMove = (e) => {
    if (!dragging) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - initialTouch.x);
    const deltaY = Math.abs(touch.clientY - initialTouch.y);

    // If moved more than 5px, consider it a drag
    if (deltaX > 5 || deltaY > 5) {
      setHasMoved(true);
      e.preventDefault();

      const newX = touch.clientX - dragStart.x;
      const newY = touch.clientY - dragStart.y;

      // Keep within screen bounds
      const maxX = window.innerWidth - 64;
      const maxY = window.innerHeight - 64;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  // Handle touch end (mobile)
  const handleTouchEnd = (e) => {
    setDragging(false);

    // If didn't move much, treat as click
    if (!hasMoved) {
      onClick();
    }

    setHasMoved(false);
  };

  // Handle mouse events (desktop fallback)
  const handleMouseDown = (e) => {
    setDragging(true);
    setHasMoved(false);
    setInitialTouch({
      x: e.clientX,
      y: e.clientY,
    });
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const deltaX = Math.abs(e.clientX - initialTouch.x);
    const deltaY = Math.abs(e.clientY - initialTouch.y);

    if (deltaX > 5 || deltaY > 5) {
      setHasMoved(true);

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = window.innerWidth - 64;
      const maxY = window.innerHeight - 64;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = (e) => {
    setDragging(false);

    // If didn't move much, treat as click
    if (!hasMoved) {
      onClick();
    }

    setHasMoved(false);
  };

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, dragStart, initialTouch, hasMoved]);

  return (
    <div
      ref={iconRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",
      }}
      className="lg:hidden" // Hide on desktop
    >
      <div
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-transform ${
          dragging ? "scale-110" : "hover:scale-110"
        } active:scale-95`}
      >
        <MessageCircle className="w-8 h-8" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>

      {/* Ripple effect */}
      {!dragging && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-ping" />
      )}
    </div>
  );
};

export default ChatIcon;
