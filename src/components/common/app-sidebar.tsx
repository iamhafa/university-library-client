"use client";

import { Book, Calendar, Home, Search, Settings, ActivitySquareIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { EAppRouter } from "@/constants/app-router.enum";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: EAppRouter.DASHBOARD,
    icon: ActivitySquareIcon,
  },
  {
    title: "Sách thư viện",
    url: EAppRouter.LIBRARY_BOOK_PAGE,
    icon: Book,
  },
  {
    title: "Tác giả",
    url: EAppRouter.AUTHOR_PAGE,
    icon: Home,
  },
  {
    title: "Thể loại sách",
    url: "#",
    icon: Search,
  },
  {
    title: "Sách cho mượn",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Quán hạn trả sách",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
