import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Flame, Sparkles, Trophy, BookOpen, X, CheckCheck, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/cn";

interface Notification {
  id: string;
  icon: LucideIcon;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "n-1",
    icon: Flame,
    title: "Streak at risk!",
    body: "Complete one lesson before midnight to keep your 23-day streak.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n-2",
    icon: Trophy,
    title: "You moved up to #14",
    body: "You passed Nina Rossi in the Emerald League. Keep pushing!",
    time: "5h ago",
    read: false,
  },
  {
    id: "n-3",
    icon: Sparkles,
    title: "AI Tutor has new exercises",
    body: "Based on your mistakes, 5 new conditional exercises are ready.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n-4",
    icon: BookOpen,
    title: "New B1 unit available",
    body: "Unit 9: 'Travel & Culture' was added to Intermediate Fluency.",
    time: "2 days ago",
    read: true,
  },
];

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        className="relative"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell aria-hidden />
        {unread > 0 && <span className="absolute top-2 right-2 size-2 rounded-full bg-accent" aria-hidden />}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-popover shadow-lifted sm:w-96"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-bold">Notifications</p>
              <div className="flex items-center gap-3">
                {unread > 0 && (
                  <button
                    onClick={() => setNotifications((list) => list.map((n) => ({ ...n, read: true })))}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <CheckCheck className="size-3.5" aria-hidden /> Mark all as read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs font-semibold text-muted-foreground hover:text-destructive hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                  <Bell className="size-6 text-muted-foreground" aria-hidden />
                  <p className="text-sm font-semibold">You&apos;re all caught up</p>
                  <p className="text-xs text-muted-foreground">New notifications will appear here.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() =>
                      setNotifications((list) =>
                        list.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                      )
                    }
                    className={cn(
                      "group flex cursor-pointer gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                      !notification.read && "bg-primary/5",
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <notification.icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{notification.title}</span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">{notification.time}</span>
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {notification.body}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end justify-between py-0.5">
                      <button
                        aria-label={`Delete notification: ${notification.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotifications((list) => list.filter((n) => n.id !== notification.id));
                        }}
                        className="rounded-md p-0.5 text-muted-foreground/70 opacity-0 transition-all hover:bg-muted-foreground/10 hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                      {!notification.read && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
