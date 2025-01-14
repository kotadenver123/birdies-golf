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
  // Separate and sort scores by type
  const grossScores = scores
    .filter((score) => score.score_type === "Gross")
    .sort((a, b) => a.score - b.score);

  const netScores = scores
    .filter((score) => score.score_type === "Net")
    .sort((a, b) => a.score - b.score);

  const ScoreSection = ({ title, scores }: { title: string; scores: EventScore[] }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        {scores.map((score: EventScore, index: number) => (
          <div
            key={`${score.team?.name}-${index}`}
            className="flex justify-between items-center p-3 bg-white rounded-lg shadow"
          >
            <div className="flex flex-col">
              <span className="font-medium">{score.team?.name || "Unknown Team"}</span>
              <span className="text-sm text-gray-500">Position: {index + 1}</span>
            </div>
            <span className="text-golf-primary font-semibold">
              {score.score ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-6">Team Scores</h2>
        {scores && scores.length > 0 ? (
          <div className="space-y-8">
            {grossScores.length > 0 && (
              <ScoreSection title="Gross Scores" scores={grossScores} />
            )}
            {netScores.length > 0 && (
              <ScoreSection title="Net Scores" scores={netScores} />
            )}
          </div>
        ) : (
          <p className="text-golf-text">No scores available yet</p>
        )}
      </CardContent>
    </Card>
  );
};