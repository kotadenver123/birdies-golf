import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventHeaderProps {
  imageUrl: string;
  title: string;
}

export const EventHeader = ({ imageUrl, title }: EventHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Seasons
      </Button>
      
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"}
        alt={title}
        className="w-full h-64 object-cover rounded-lg mb-8"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e";
        }}
      />
      
      <h1 className="text-3xl font-bold text-golf-secondary mb-6">{title}</h1>
    </>
  );
};