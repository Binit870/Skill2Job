import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Briefcase, UserCheck } from "lucide-react";
import api from "../utils/api";

const ICONS = {
  application_submitted: UserCheck,
  application_status: Briefcase,
  job_posted: Briefcase,
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/api/notifications");
      setNotifications(data.data);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Light polling — no websocket infra in this app, 60s is a reasonable
    // balance between freshness and not hammering the API.
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen((v) => !v);
  };

  const handleNotificationClick = async (n) => {
    if (!n.read) {
      try {
        await api.patch(`/api/notifications/${n._id}/read`);
        setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error(err);
      }
    }
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      await api.patch("/api/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-ink/5 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-ink/60" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-mist rounded-2xl shadow-card-hover z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-mist">
            <span className="text-sm font-bold text-ink">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="flex items-center gap-1 text-[11px] font-semibold text-pine hover:text-moss transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-6 h-6 text-ink/20 mx-auto mb-2" />
                <p className="text-xs text-ink/40">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                  <button
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 flex gap-3 border-b border-mist last:border-0 transition-colors hover:bg-ink/5
                      ${!n.read ? "bg-pine/5" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${!n.read ? "bg-pine/10 text-pine" : "bg-ink/5 text-ink/40"}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs leading-snug ${!n.read ? "font-semibold text-ink" : "font-medium text-ink/60"}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-ink/45 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-ink/35 mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-pine shrink-0 mt-1.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
