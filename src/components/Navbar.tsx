import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, Users, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Home", icon: <Home className="h-4 w-4" />, href: "/" },
    { label: "League", icon: <Users className="h-4 w-4" />, href: "/league" },
    { label: "Contact Us", icon: <MessageSquare className="h-4 w-4" />, href: "/contact" },
  ];

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="https://assets.cdn.filesafe.space/rcmGQAVicau7s4CkgnuX/media/6e24e1a5-a049-495d-8f01-e4473378594f.png"
              alt="Logo"
              className="h-12 object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <Button variant="ghost" className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
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
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        {item.icon}
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}