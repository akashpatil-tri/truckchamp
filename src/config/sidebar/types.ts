import { StaticImageData } from "next/image";

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: StaticImageData | string;
  badge?: string | number;
  children?: SidebarItem[];
}

export type UserRole = "construction_admin" | "truck_operator" | "super_admin";

export interface SidebarConfig {
  role: UserRole;
  items: SidebarItem[];
}
