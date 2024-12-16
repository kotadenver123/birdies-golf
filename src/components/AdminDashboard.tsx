import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        {/* Logo Section */}
        <div className="flex justify-center py-4 bg-white">
          <img 
            src="https://assets.cdn.filesafe.space/rcmGQAVicau7s4CkgnuX/media/6e24e1a5-a049-495d-8f01-e4473378594f.png" 
            alt="Logo" 
            className="h-16 object-contain"
          />
        </div>
        
        {/* Navigation Section */}
        <nav className="flex gap-2 pb-4">
          <Link to="/admin">
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              className={isActive("/admin") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/admin/seasons">
            <Button
              variant={isActive("/admin/seasons") ? "default" : "ghost"}
              className={isActive("/admin/seasons") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Seasons
            </Button>
          </Link>
          <Link to="/admin/events">
            <Button
              variant={isActive("/admin/events") ? "default" : "ghost"}
              className={isActive("/admin/events") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Events
            </Button>
          </Link>
          <Link to="/admin/teams">
            <Button
              variant={isActive("/admin/teams") ? "default" : "ghost"}
              className={isActive("/admin/teams") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Teams
            </Button>
          </Link>
          <Link to="/admin/players">
            <Button
              variant={isActive("/admin/players") ? "default" : "ghost"}
              className={isActive("/admin/players") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Players
            </Button>
          </Link>
          <Link to="/admin/scores">
            <Button
              variant={isActive("/admin/scores") ? "default" : "ghost"}
              className={isActive("/admin/scores") ? "bg-golf-accent hover:bg-golf-accent/90" : ""}
            >
              Scores
            </Button>
          </Link>
        </nav>
      </div>
    </div>
  );
}