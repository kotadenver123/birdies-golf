import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EventDetailsProps {
  details: string | null;
}

export const EventDetails = ({ details }: EventDetailsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-golf-accent" />
          <h2 className="text-xl font-semibold">Event Details</h2>
        </div>
        <p className="text-golf-text text-left">{details || "No additional details available"}</p>
      </CardContent>
    </Card>
  );
};