import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Season {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
}

interface SeasonHeaderProps {
  season: string;
  dates: string;
  seasons: Season[];
  onSeasonChange: (seasonId: string) => void;
  currentSeasonId: string;
}

export const SeasonHeader = ({ 
  season, 
  dates, 
  seasons,
  onSeasonChange,
  currentSeasonId
}: SeasonHeaderProps) => {
  return (
    <div className="bg-golf-primary text-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{season}</h1>
          <div className="flex items-center text-golf-accent">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>{dates}</span>
          </div>
        </div>
        <Select value={currentSeasonId} onValueChange={onSeasonChange}>
          <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};