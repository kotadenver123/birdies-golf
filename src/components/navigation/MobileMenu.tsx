import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuItem } from "./types";
import { NavLink } from "./NavLink";

interface MobileMenuProps {
  menuItems: MenuItem[];
  isActive: (href: string) => boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function MobileMenu({ menuItems, isActive, isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col space-y-4 mt-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive(item.href)}
                external={item.external}
                className="w-full justify-start"
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}