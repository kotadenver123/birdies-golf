interface FlightSelectorProps {
  currentFlight: string;
  onFlightChange: (flight: string) => void;
}

export const FlightSelector = ({
  currentFlight,
  onFlightChange,
}: FlightSelectorProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={() => onFlightChange("A")}
        className={`px-4 py-2 rounded ${
          currentFlight === "A"
            ? "bg-golf-primary text-white"
            : "bg-white text-golf-primary"
        }`}
      >
        Flight A
      </button>
      <button
        onClick={() => onFlightChange("B")}
        className={`px-4 py-2 rounded ${
          currentFlight === "B"
            ? "bg-golf-primary text-white"
            : "bg-white text-golf-primary"
        }`}
      >
        Flight B
      </button>
    </div>
  );
};