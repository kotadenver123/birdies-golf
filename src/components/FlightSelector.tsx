interface FlightSelectorProps {
  currentFlight: string;
  onFlightChange: (flight: string) => void;
  availableFlights: string[];
}

export const FlightSelector = ({
  currentFlight,
  onFlightChange,
  availableFlights,
}: FlightSelectorProps) => {
  return (
    <div className="flex items-center space-x-4 mb-4 overflow-x-auto">
      {availableFlights.map((flight) => (
        <button
          key={flight}
          onClick={() => onFlightChange(flight)}
          className={`px-4 py-2 rounded whitespace-nowrap ${
            currentFlight === flight
              ? "bg-golf-primary text-white"
              : "bg-white text-golf-primary"
          }`}
        >
          {flight}
        </button>
      ))}
    </div>
  );
};