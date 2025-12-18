import Image from "next/image";
import Link from "next/link";

import { getSidebarConfig, type UserRole } from "@/config/sidebar";

interface SideBarProps {
  userRole: UserRole;
  pathname: string;
}

export default function SideBar({ userRole, pathname }: SideBarProps) {
  const sidebarConfig = getSidebarConfig(userRole);

  return (
    <aside className="main-sidebar">
      <div className="sidebar sidebar-menu-main">
        <nav className="sidebar-menu">
          <ul className="nav-sidebar flex-column">
            {sidebarConfig.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li
                  key={item.id}
                  className={`sb-nav-item ${isActive ? "active" : ""}`}
                >
                  <Link href={item.href} className="sb-nav-link">
                    <Image
                      className="sb-nav-icon"
                      src={item.icon}
                      alt={`${item.label} icon`}
                      width={24}
                      height={24}
                    />
                    <p>
                      {item.label}
                      {item.badge && (
                        <span className="badge badge-primary ml-2">
                          {item.badge}
                        </span>
                      )}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
