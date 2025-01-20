import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter available teams based on search query and already selected teams
  const availableTeams = (teams || [])
    .filter(team => 
      !selectedTeams.includes(team.id) && 
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      
      {searchQuery && availableTeams.length > 0 && (
        <div className="grid gap-2">
          {availableTeams.map((team) => (
            <Button
              key={team.id}
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => {
                onTeamSelect(team.id);
                setSearchQuery("");
              }}
            >
              {team.name}
            </Button>
          ))}
        </div>
      )}
      
      {searchQuery && availableTeams.length === 0 && (
        <p className="text-sm text-muted-foreground">No teams found</p>
      )}
    </div>
  );
}