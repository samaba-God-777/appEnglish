import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ChevronsLeft, ChevronsRight, Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSidebarStore } from "@/store/sidebar";
import { useUser } from "@/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { navSections } from "./nav-config";

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebarStore();
  const user = useUser();

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <motion.aside
        animate={{ width: collapsed ? 76 : 264 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar",
          "max-lg:w-[264px] max-lg:transition-transform max-lg:duration-200",
          mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          "lg:sticky lg:top-0 lg:h-dvh lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" aria-hidden />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight">EnglishAI Pro</p>
              <p className="truncate text-[11px] text-muted-foreground">Learn smarter with AI</p>
            </div>
          )}
        </div>

        <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors duration-150",
                          "hover:bg-muted hover:text-foreground",
                          isActive && "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary",
                          collapsed && "justify-center px-2",
                        )
                      }
                    >
                      <item.icon className="size-[18px] shrink-0" aria-hidden />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted",
              collapsed && "justify-center",
            )}
          >
            <Avatar initials={user.avatarInitials} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Flame className="size-3 text-accent" aria-hidden />
                  {user.streakDays} day streak
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-1 hidden w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:flex"
          >
            {collapsed ? <ChevronsRight className="size-4" aria-hidden /> : <ChevronsLeft className="size-4" aria-hidden />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
