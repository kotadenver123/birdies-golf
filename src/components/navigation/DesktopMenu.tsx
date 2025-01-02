import { MenuItem } from "./types";
import { NavLink } from "./NavLink";

interface DesktopMenuProps {
  menuItems: MenuItem[];
  isActive: (href: string) => boolean;
}

export function DesktopMenu({ menuItems, isActive }: DesktopMenuProps) {
  return (
    <div className="hidden md:flex space-x-4">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={isActive(item.href)}
          external={item.external}
        />
      ))}
    </div>
  );
}