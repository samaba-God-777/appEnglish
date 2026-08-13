import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Settings, Medal, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useAuthStore, useUser } from "@/store/auth";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const items = [
    { label: "Profile", icon: User, to: "/settings" },
    { label: "Achievements", icon: Medal, to: "/achievements" },
    { label: "Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className="ml-1 rounded-full transition-transform hover:scale-105"
      >
        <Avatar initials={user.avatarInitials} size="sm" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-lifted"
          >
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="p-1.5">
              {items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <item.icon className="size-4 text-muted-foreground" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border p-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                  navigate("/login");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
