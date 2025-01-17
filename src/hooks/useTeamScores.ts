import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamScore } from "@/components/admin/forms/types/scores";

export function useTeamScores(seasonId: string | null, eventId: string | null) {
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);

  useEffect(() => {
    const fetchTeamsAndScores = async () => {
      if (!seasonId) return;

      const { data: seasonTeams, error: seasonTeamsError } = await supabase
        .from("season_teams")
        .select(`
          team_id,
          flight,
          teams (
            name
          )
        `)
        .eq("season_id", seasonId);

      if (seasonTeamsError) {
        console.error("Error fetching season teams:", seasonTeamsError);
        return;
      }

      const teamMap = new Map<string, TeamScore>();
      seasonTeams.forEach((st) => {
        const existingTeam = teamMap.get(st.team_id);
        if (existingTeam) {
          existingTeam.flights.push(st.flight);
        } else {
          teamMap.set(st.team_id, {
            teamId: st.team_id,
            teamName: st.teams?.name || "",
            flights: [st.flight],
            existingScores: {},
            newScores: {},
          });
        }
      });

      if (eventId) {
        const { data: existingScores, error: scoresError } = await supabase
          .from("event_scores")
          .select("*")
          .eq("event_id", eventId);

        if (!scoresError && existingScores) {
          existingScores.forEach((score) => {
            const team = teamMap.get(score.team_id);
            if (team) {
              team.existingScores[score.flight] = {
                id: score.id,
                score: score.score.toString(),
              };
            }
          });
        }
      }

      setTeamScores(Array.from(teamMap.values()));
    };

    fetchTeamsAndScores();
  }, [seasonId, eventId]);

  const handleScoreChange = (teamId: string, flight: string, value: string) => {
    setTeamScores((prev) =>
      prev.map((team) => {
        if (team.teamId === teamId) {
          return {
            ...team,
            newScores: {
              ...team.newScores,
              [flight]: value,
            },
          };
        }
        return team;
      })
    );
  };

  return {
    teamScores,
    handleScoreChange,
  };
}