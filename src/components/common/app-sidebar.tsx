"use client";

import {
  Calendar,
  Settings,
  ActivitySquareIcon,
  EditIcon,
  Library,
  User,
  LogOut,
  BookOpen,
  Clock,
  Tags,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { EAppRouter } from "@/constants/app-router.enum";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items với icons được cải thiện
const items = [
  {
    title: "Dashboard",
    url: EAppRouter.DASHBOARD,
    icon: ActivitySquareIcon,
    description: "Tổng quan hệ thống",
  },
  {
    title: "Sách thư viện",
    url: EAppRouter.BOOK_MANGEMENT_PAGE,
    icon: BookOpen,
    description: "Quản lý sách",
  },
  {
    title: "Tác giả",
    url: EAppRouter.AUTHOR_MANAGEMENT_PAGE,
    icon: EditIcon,
    description: "Quản lý tác giả",
  },
  {
    title: "Thể loại sách",
    url: "#",
    icon: Tags,
    description: "Phân loại sách",
  },
  {
    title: "Sách cho mượn",
    url: EAppRouter.BORROWING_MANAGEMENT_PAGE,
    icon: Calendar,
    description: "Theo dõi mượn sách",
  },
  {
    title: "Quá hạn trả sách",
    url: "#",
    icon: Clock,
    description: "Sách quá hạn",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();

  return (
    <div className="relative">
      <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Header với logo và brand */}
        <SidebarHeader className="border-b border-border/40 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Library className="h-6 w-6 text-primary-foreground" />
            </div>
            {open && (
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-foreground">Library</h1>
                <p className="text-xs text-muted-foreground">Quản lý thư viện</p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Điều hướng chính
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "#" && pathname.startsWith(item.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "group relative h-11 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        )}
                        tooltip={item.description}
                      >
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <item.icon
                            className={cn(
                              "h-4 w-4 transition-colors flex-shrink-0",
                              isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                            )}
                          />
                          {open && (
                            <div className="flex flex-col items-start min-w-0 flex-1">
                              <span className="font-medium truncate">{item.title}</span>
                              <span
                                className={cn(
                                  "text-xs transition-colors truncate",
                                  isActive ? "text-primary-foreground/70" : "text-muted-foreground/70"
                                )}
                              >
                                {item.description}
                              </span>
                            </div>
                          )}
                          {/* Active indicator */}
                          {isActive && open && <div className="absolute right-2 h-2 w-2 rounded-full bg-primary-foreground/80" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Stats */}
          {open && (
            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Thống kê nhanh
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-border/40 bg-card p-3 text-center">
                    <div className="text-lg font-semibold text-foreground">1,234</div>
                    <div className="text-xs text-muted-foreground">Tổng sách</div>
                  </div>
                  <div className="rounded-lg border border-border/40 bg-card p-3 text-center">
                    <div className="text-lg font-semibold text-foreground">56</div>
                    <div className="text-xs text-muted-foreground">Đang mượn</div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer với user profile */}
        <SidebarFooter className="border-t border-border/40 p-4">
          {open ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-12 px-3 hover:bg-accent">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left min-w-0 flex-1">
                    <span className="text-sm font-medium text-foreground truncate">Admin</span>
                    <span className="text-xs text-muted-foreground truncate">admin@library.com</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">AD</AvatarFallback>
              </Avatar>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Fixed Toggle Button - Always visible */}
      <Button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-6 z-50 h-10 w-10 p-0 rounded-full shadow-lg transition-all duration-300 ease-in-out",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "border-2 border-background",
          "hover:scale-110 hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          // Position based on sidebar state
          open ? "left-64" : "left-1",
          // Transform on hover
          "group"
        )}
        size="sm"
      >
        <div className="transition-transform duration-200 group-hover:scale-110">
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </div>

        {/* Tooltip */}
        <div
          className={cn(
            "absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none",
            "whitespace-nowrap z-50"
          )}
        >
          {open ? "Thu gọn sidebar" : "Mở rộng sidebar"}
        </div>
      </Button>
    </div>
  );
}
