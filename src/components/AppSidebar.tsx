import { LayoutDashboard, Store, Users, ShoppingBag, Wallet, Package, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type SectionKey = "overview" | "boutiques" | "users" | "ventes" | "finances" | "inventaire";

interface Props {
  active: SectionKey;
  onChange: (k: SectionKey) => void;
}

const items: { key: SectionKey; title: string; icon: typeof Store }[] = [
  { key: "overview", title: "Vue d'ensemble", icon: LayoutDashboard },
  { key: "boutiques", title: "Boutiques", icon: Store },
  { key: "users", title: "Utilisateurs", icon: Users },
  { key: "ventes", title: "Ventes", icon: ShoppingBag },
  { key: "finances", title: "Finances", icon: Wallet },
  { key: "inventaire", title: "Inventaire", icon: Package },
];

const AppSidebar = ({ active, onChange }: Props) => {
  const { state, setOpen, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const handleSelect = (k: SectionKey) => {
    onChange(k);
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-base leading-none">GAMA</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Boutique</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.key}>
                  <SidebarMenuButton
                    isActive={active === it.key}
                    onClick={() => handleSelect(it.key)}
                    className="hover:bg-sidebar-accent"
                  >
                    <it.icon className="h-4 w-4" />
                    {!collapsed && <span>{it.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
