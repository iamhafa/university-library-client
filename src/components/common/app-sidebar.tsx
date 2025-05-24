"use client";

import { Book, Calendar, Home, Search, Settings, ActivitySquareIcon, EditIcon } from "lucide-react";

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
import Link from "next/link";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: EAppRouter.DASHBOARD,
    icon: ActivitySquareIcon,
  },
  {
    title: "Sách thư viện",
    url: EAppRouter.BOOK_MANGEMENT_PAGE,
    icon: Book,
  },
  {
    title: "Tác giả",
    url: EAppRouter.AUTHOR_MANGEMENT_PAGE,
    icon: EditIcon,
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
  const router = useRouter();

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
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
