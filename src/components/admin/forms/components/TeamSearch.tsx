import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface Team {
  id: string;
  name: string;
}

interface TeamSearchProps {
  teams: Team[];
  onTeamSelect: (teamId: string) => void;
  selectedTeams: string[];
}

export function TeamSearch({ teams = [], onTeamSelect, selectedTeams = [] }: TeamSearchProps) {
  const [open, setOpen] = useState(false);

  // Ensure we have arrays even if undefined is passed
  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeSelectedTeams = Array.isArray(selectedTeams) ? selectedTeams : [];

  const availableTeams = safeTeams.filter(team => !safeSelectedTeams.includes(team.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Select team...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." />
          <CommandEmpty>No team found.</CommandEmpty>
          <CommandGroup>
            {availableTeams.map((team) => (
              <CommandItem
                key={team.id}
                value={team.name}
                onSelect={() => {
                  onTeamSelect(team.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    safeSelectedTeams.includes(team.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {team.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}