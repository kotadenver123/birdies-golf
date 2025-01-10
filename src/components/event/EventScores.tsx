import { Card, CardContent } from "@/components/ui/card";

interface EventScore {
  team?: {
    name: string;
  };
  score: number;
  score_type: string;
}

interface EventScoresProps {
  scores: EventScore[];
}

export const EventScores = ({ scores }: EventScoresProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Team Scores</h2>
        {scores && scores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scores.map((score: EventScore, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{score.team?.name || "Unknown Team"}</span>
                  <span className="text-sm text-gray-500">{score.score_type}</span>
                </div>
                <span className="text-golf-primary font-semibold">
                  {score.score ?? "-"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-golf-text">No scores available yet</p>
        )}
      </CardContent>
    </Card>
  );
};