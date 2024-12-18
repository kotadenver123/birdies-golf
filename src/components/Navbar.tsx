import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Home, Users } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Home", icon: <Home className="h-4 w-4" />, href: "https://birdiesgolflounge.com", external: true },
    { label: "League", icon: <Users className="h-4 w-4" />, href: "/", external: false },
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
              item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="flex items-center gap-2">
                    {item.icon}
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.label} to={item.href}>
                  <Button 
                    variant={isActive(item.href) ? "secondary" : "ghost"} 
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              )
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
                    item.external ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      </a>
                    ) : (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2"
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      </Link>
                    )
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