import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, Users } from "lucide-react";
import { NavLogo } from "./navigation/NavLogo";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { MobileMenu } from "./navigation/MobileMenu";
import type { MenuItem } from "./navigation/types";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { label: "Home", icon: Home, href: "https://birdiesgolflounge.com", external: true },
    { label: "League", icon: Users, href: "/", external: false },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <NavLogo />
          <DesktopMenu menuItems={menuItems} isActive={isActive} />
          <MobileMenu 
            menuItems={menuItems} 
            isActive={isActive}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </nav>
  );
}