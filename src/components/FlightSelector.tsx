
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
    <div className="grid grid-cols-2 md:flex md:flex-row items-center gap-2 mb-4 overflow-x-auto">
      {availableFlights.map((flight) => (
        <button
          key={flight}
          onClick={() => onFlightChange(flight)}
          className={`px-4 py-2 rounded whitespace-nowrap w-full ${
            currentFlight === flight
              ? "bg-golf-primary text-white"
              : "bg-white text-golf-primary"
          }`}
        >
          Flight {flight}
        </button>
      ))}
    </div>
  );
};
