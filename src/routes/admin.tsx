import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";
import {
  LayoutDashboard, FolderKanban, Image as ImageIcon, Newspaper, MessageSquareQuote,
  Activity, Users, IndianRupee, Mail, Send, Settings, LogOut, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Creative Ashoka Foundation" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/blogs", label: "News & Blogs", icon: Newspaper },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/impact", label: "Impact Stats", icon: Activity },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  
  { to: "/admin/donations", label: "Donations", icon: IndianRupee },
  { to: "/admin/contacts", label: "Contact Messages", icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", icon: Send },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || isAdmin === null) {
    return <div className="grid min-h-dvh place-items-center text-muted-foreground">Loading admin...</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) does not have admin permissions. Contact the foundation administrator.
          </p>
          <Button className="mt-6" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-secondary/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-md gradient-accent text-accent-foreground">
            <Heart className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-bold text-primary">Creative Ashoka</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin CMS</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to as any}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active ? "bg-primary text-primary-foreground font-medium" : "text-foreground/80 hover:bg-secondary"
                }`}>
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3 space-y-2">
          <Link to="/" className="block rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-secondary">← View site</Link>
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
          <div className="text-sm text-muted-foreground truncate">Signed in as <span className="font-medium text-foreground">{user.email}</span></div>
          <Link to="/" className="text-sm text-primary hover:underline">View site</Link>
        </header>
        <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
