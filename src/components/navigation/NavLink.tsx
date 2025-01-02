import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ 
  href, 
  label, 
  icon: Icon, 
  isActive, 
  external = false,
  className = "",
  onClick 
}: NavLinkProps) {
  const ButtonContent = (
    <Button 
      variant={isActive ? "secondary" : "ghost"} 
      className={`flex items-center gap-2 ${isActive ? 'text-white [&_svg]:text-white' : ''} ${className}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {ButtonContent}
      </a>
    );
  }

  return <Link to={href}>{ButtonContent}</Link>;
}