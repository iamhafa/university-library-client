'use client';

import { Book, Calendar, Home, Search, Settings } from 'lucide-react';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { EAppRouter } from '@/constants/app-router.enum';

// Menu items.
const items = [
	{
		title: 'Tác giả',
		url: EAppRouter.AUTHOR_PAGE,
		icon: Home,
	},
	{
		title: 'Sách',
		url: EAppRouter.BOOK_PAGE,
		icon: Book,
	},
	{
		title: 'Thể loại sách',
		url: '#',
		icon: Search,
	},
	{
		title: 'Sách cho mượn',
		url: '#',
		icon: Calendar,
	},
	{
		title: 'Quán hạn trả sách',
		url: '#',
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
