import { LayoutDashboard, ShoppingBag, Wallet, Sparkles, Shirt, FileBarChart2 } from "lucide-react";
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

export type VendeurSection = "overview" | "articles" | "ventes" | "finances" | "rapport";

interface Props {
  active: VendeurSection;
  onChange: (k: VendeurSection) => void;
  boutiqueName?: string | null;
}

const items: { key: VendeurSection; title: string; icon: typeof Shirt }[] = [
  { key: "overview", title: "Vue d'ensemble", icon: LayoutDashboard },
  { key: "articles", title: "Articles", icon: Shirt },
  { key: "ventes", title: "Ventes", icon: ShoppingBag },
  { key: "finances", title: "Finances", icon: Wallet },
  { key: "rapport", title: "Rapport", icon: FileBarChart2 },
];

const VendeurSidebar = ({ active, onChange, boutiqueName }: Props) => {
  const { state, setOpen, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const handleSelect = (k: VendeurSection) => {
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
            <div className="min-w-0">
              <div className="font-bold text-base leading-none truncate">{boutiqueName ?? "GAMA"}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Boutique</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Espace vendeur</SidebarGroupLabel>
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

export default VendeurSidebar;
