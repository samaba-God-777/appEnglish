import { Link } from "react-router-dom";
import { Sun, Moon, Menu, Gem, Coins } from "lucide-react";
import { useThemeStore } from "@/store/theme";
import { useSidebarStore } from "@/store/sidebar";
import { useUser } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./topbar/GlobalSearch";
import { NotificationsMenu } from "./topbar/NotificationsMenu";
import { ProfileMenu } from "./topbar/ProfileMenu";

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore();
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const user = useUser();

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu aria-hidden />
      </Button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1.5">
        <Link
          to="/achievements"
          title="View rewards"
          className="mr-1 hidden items-center gap-3 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold transition-colors hover:bg-muted sm:flex"
        >
          <span className="flex items-center gap-1 text-accent">
            <Coins className="size-3.5" aria-hidden />
            {user.coins.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Gem className="size-3.5" aria-hidden />
            {user.diamonds}
          </span>
        </Link>

        <NotificationsMenu />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
        </Button>

        <ProfileMenu />
      </div>
    </header>
  );
}
