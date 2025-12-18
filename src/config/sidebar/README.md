# Sidebar Configuration

This directory contains role-based sidebar configurations for different user types.

## 📁 Structure

```
src/config/sidebar/
├── types.ts                    # TypeScript types and interfaces
├── construction-admin.ts       # Construction Admin sidebar config
├── truck-operator.ts          # Truck Operator sidebar config
├── super-admin.ts             # Super Admin sidebar config
├── index.ts                   # Main export file with getSidebarConfig()
└── README.md                  # This file
```

## 🎯 Usage

### In Layout Components

```typescript
import { getSidebarConfig } from "@/config/sidebar";
import SideBar from "@layout/dashboard/sidebar/page";

export default function Layout({ children }) {
  const userRole = "construction_admin"; // Get from auth context
  
  return (
    <div>
      <SideBar userRole={userRole} />
      {children}
    </div>
  );
}
```

### In Sidebar Component

```typescript
import { getSidebarConfig, type UserRole } from "@/config/sidebar";

interface SideBarProps {
  userRole: UserRole;
}

export default function SideBar({ userRole }: SideBarProps) {
  const sidebarConfig = getSidebarConfig(userRole);
  
  return (
    <nav>
      {sidebarConfig.items.map(item => (
        <Link key={item.id} href={item.href}>
          <Image src={item.icon} alt={item.label} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
```

## 🔧 Adding New Sidebar Items

### 1. Add to Role-Specific Config

Edit the appropriate file (e.g., `construction-admin.ts`):

```typescript
export const constructionAdminSidebar: SidebarConfig = {
  role: "construction_admin",
  items: [
    // ... existing items
    {
      id: "new-feature",
      label: "New Feature",
      href: "/new-feature",
      icon: newFeatureIcon,
      badge: "New", // Optional
    },
  ],
};
```

### 2. Import Required Icons

```typescript
import newFeatureIcon from "@assets/svg/new-feature-icon.svg";
```

## 🎨 Adding New User Role

### 1. Update Types

```typescript
// types.ts
export type UserRole = 
  | "construction_admin" 
  | "truck_operator" 
  | "super_admin"
  | "new_role"; // Add new role
```

### 2. Create Config File

```typescript
// new-role.ts
import { SidebarConfig } from "./types";

export const newRoleSidebar: SidebarConfig = {
  role: "new_role",
  items: [
    // Define sidebar items
  ],
};
```

### 3. Register in Index

```typescript
// index.ts
import { newRoleSidebar } from "./new-role";

const sidebarConfigs: Record<UserRole, SidebarConfig> = {
  construction_admin: constructionAdminSidebar,
  truck_operator: truckOperatorSidebar,
  super_admin: superAdminSidebar,
  new_role: newRoleSidebar, // Add here
};
```

## 📝 Sidebar Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier |
| `label` | string | ✅ | Display text |
| `href` | string | ✅ | Navigation path |
| `icon` | StaticImageData \| string | ✅ | Icon image |
| `badge` | string \| number | ❌ | Badge text/count |
| `children` | SidebarItem[] | ❌ | Nested items |

## 🔍 Current Roles

### Construction Admin
- Dashboard
- Job Management
- Team Management
- Billing & Invoicing
- Rating & Reviews

### Truck Operator
- Dashboard
- Available Jobs
- My Jobs
- Drivers
- Truck Fleet
- Earnings
- Notifications

### Super Admin
- Admin Dashboard
- User Management
- Construction Companies
- Truck Operators
- All Jobs
- Payments & Transactions
- Reports & Analytics
- System Settings
