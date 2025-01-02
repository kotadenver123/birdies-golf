import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EventFormatProps {
  format: string | null;
}

export const EventFormat = ({ format }: EventFormatProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-golf-accent" />
          <h2 className="text-xl font-semibold">Format</h2>
        </div>
        <p className="text-golf-text text-left">{format || "Format to be announced"}</p>
      </CardContent>
    </Card>
  );
};